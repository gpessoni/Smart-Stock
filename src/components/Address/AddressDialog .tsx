import { useState, useEffect, useRef } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { ConfirmDialog } from "primereact/confirmdialog"

type Address = {
    id: string | null
    address: string
    description: string
    storageId: string
    createdAt?: Date
    updatedAt?: Date
}

type AddressDialogProps = {
    storageId: string
    visible: boolean
    onHide: () => void
}

const AddressDialog = ({ storageId, visible, onHide }: AddressDialogProps) => {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [addressDialog, setAddressDialog] = useState<boolean>(false)
    const [address, setAddress] = useState<Address>({
        id: null,
        address: "",
        description: "",
        storageId: storageId,
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    const toast = useRef<Toast>(null)

    useEffect(() => {
        if (visible) {
            fetchAddresses()
        }
    }, [visible])

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`/api/addresses`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setAddresses(data.filter((a: Address) => a.storageId === storageId))
            setLoading(false)
        } catch (error) {
            console.error("Erro ao buscar endereços:", error)
        }
    }

    const saveAddress = async () => {
        setSubmitted(true)

        if (address.address.trim() && address.description.trim()) {
            let _addresses = [...addresses]
            try {
                console.log("Payload enviado:", JSON.stringify(address))

                const isUpdating = !!address.id
                const response = await fetch(isUpdating ? `/api/addresses/${address.id}` : "/api/addresses", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ address: address.address, description: address.description, storageId: storageId }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Endereço"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _addresses.push(result)
                } else {
                    _addresses[_addresses.findIndex((g) => g.id === address.id)] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Endereço atualizado com sucesso" : "Endereço criado com sucesso",
                    life: 3000,
                })

                setAddresses(_addresses)
                setAddressDialog(false)
                setAddress({ id: null, address: "", description: "", storageId: storageId })
            } catch (error) {
                console.error("Erro ao salvar Endereço:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Endereço"
                toast.current?.show({ severity: "error", summary: "Erro", detail: errorMessage, life: 4000 })
            }
        } else {
            toast.current?.show({
                severity: "warn",
                summary: "Atenção",
                detail: "Preencha todos os campos obrigatórios.",
                life: 3000,
            })
        }
    }

    const editAddress = (address: Address) => {
        setAddress({ ...address })
        setAddressDialog(true)
    }

    const confirmDeleteAddress = (address: Address) => {
        setAddressToDelete(address)
        setDeleteDialog(true)
    }

    const deleteAddress = async () => {
        if (addressToDelete) {
            try {
                const response = await fetch(`/api/addresses/${addressToDelete.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })

                if (response.ok) {
                    let _addresses = addresses.filter((val) => val.id !== addressToDelete.id)
                    setAddresses(_addresses)
                    toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Endereço deletado com sucesso", life: 3000 })
                    setAddress({ id: null, address: "", description: "", storageId: storageId })
                } else {
                    throw new Error("Erro ao deletar Endereço")
                }
            } catch (error) {
                console.error("Erro ao deletar Endereço:", error)
                toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar Endereço", life: 3000 })
            } finally {
                setDeleteDialog(false)
            }
        }
    }

    const addressDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => setAddressDialog(false)} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveAddress} />
        </>
    )

    const deleteDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Sim" icon="pi pi-check" className="p-button-danger" onClick={deleteAddress} />
        </>
    )

    return (
        <>
            <Toast ref={toast} />
            <Dialog draggable={false} visible={visible} style={{ width: "1200px" }} header="Endereços do Armazém" modal className="p-fluid" onHide={onHide}>
                <Toolbar
                    className="p-mb-4 p-toolbar"
                    left={<Button label="Novo Endereço" icon="pi pi-plus" className="p-button-success" onClick={() => setAddressDialog(true)} />}
                />
                <DataTable value={addresses} loading={loading} paginator rows={5}>
                    <Column field="address" header="Endereço" sortable />
                    <Column field="description" header="Descrição" sortable />
                    <Column
                        align="center"
                        field="createdAt"
                        header="Data de Criação"
                        body={(rowData) => {
                            const date = new Date(rowData.createdAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                        }}
                        sortable
                    ></Column>
                    <Column
                        align="center"
                        field="updatedAt"
                        header="Data de Atualização"
                        body={(rowData) => {
                            const date = new Date(rowData.updatedAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                        }}
                        sortable
                    ></Column>
                    <Column
                        body={(rowData: Address) => (
                            <>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAddress(rowData)} />
                                <Button
                                    icon="pi pi-trash"
                                    style={{
                                        marginLeft: 10,
                                    }}
                                    className="p-button-rounded p-button-danger"
                                    onClick={() => confirmDeleteAddress(rowData)}
                                />
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={addressDialog}
                    style={{ width: "450px" }}
                    header="Endereço"
                    modal
                    className="p-fluid"
                    footer={addressDialogFooter}
                    onHide={() => setAddressDialog(false)}
                >
                    <div className="field" style={{ marginTop: "10px" }}>
                        <label htmlFor="address">Endereço</label>
                        <InputText id="address" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} required />
                    </div>
                    <div className="field" style={{ marginTop: "10px" }}>
                        <label htmlFor="description">Descrição</label>
                        <InputText
                            id="description"
                            value={address.description}
                            onChange={(e) => setAddress({ ...address, description: e.target.value })}
                            required
                        />
                    </div>
                </Dialog>
            </Dialog>

            <ConfirmDialog
                visible={deleteDialog}
                onHide={() => setDeleteDialog(false)}
                message={`Você tem certeza que deseja deletar o Endereço ${addressToDelete?.description}?`}
                header="Confirmação"
                footer={deleteDialogFooter}
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-danger"
                acceptLabel="Sim"
                rejectClassName="p-button-secondary"
                rejectLabel="Não"
            />
        </>
    )
}

export default AddressDialog
