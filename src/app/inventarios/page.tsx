"use client"

import DeleteButton from "@/components/Forms/DeleteButton"
import Navbar from "@/components/Navbar"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"

type Inventory = {
    id: string
    productId: string
    storageAddressId: string
    quantity: number
    status: string
    createdAt: string
    updatedAt: string
    product: {
        code: string
        description: string
    }
    storageAddress: {
        address: string
    }
}

type DropdownOption = {
    label: string
    value: string
}

export default function Inventories() {
    const [loading, setLoading] = useState<boolean>(true)
    const [inventories, setInventories] = useState<Inventory[]>([])
    const [inventoryDialog, setInventoryDialog] = useState<boolean>(false)
    const [inventory, setInventory] = useState<Inventory>({
        id: "",
        productId: "",
        storageAddressId: "",
        quantity: 0,
        status: "UNPROCESSED",
        createdAt: "",
        updatedAt: "",
        product: {
            code: "",
            description: "",
        },
        storageAddress: {
            address: "",
        },
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [productOptions, setProductOptions] = useState<DropdownOption[]>([])
    const [storageAddressOptions, setStorageAddressOptions] = useState<DropdownOption[]>([])

    const [visible, setVisible] = useState(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        fetchInventories()
        fetchDropdownOptions()
        setLoading(false)
    }, [])

    const fetchInventories = async () => {
        try {
            const response = await fetch("/api/product-inventory")
            const data = await response.json()
            setInventories(data)
        } catch (error) {
            console.error("Erro ao buscar inventários:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar inventários", life: 3000 })
        }
    }

    const fetchDropdownOptions = async () => {
        try {
            const [products, storageAddresses] = await Promise.all([
                fetch("/api/products").then((res) => res.json()),
                fetch("/api/addresses").then((res) => res.json()),
            ])

            setProductOptions(products.map((p: any) => ({ label: p.description, value: p.id })))
            setStorageAddressOptions(storageAddresses.map((sa: any) => ({ label: sa.address, value: sa.id })))
        } catch (error) {
            console.error("Erro ao buscar opções de dropdown:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar opções", life: 3000 })
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo Inventário" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button
                    label="Processar Inventários"
                    icon="pi pi-check"
                    className="p-button-info"
                    onClick={() => {
                        setVisible(true)
                    }}
                />
            </div>
        )
    }

    const openNew = () => {
        setInventory({
            id: "",
            productId: "",
            storageAddressId: "",
            quantity: 0,
            status: "UNPROCESSED",
            createdAt: "",
            updatedAt: "",
            product: {
                code: "",
                description: "",
            },
            storageAddress: {
                address: "",
            },
        })
        setSubmitted(false)
        setInventoryDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setInventoryDialog(false)
    }

    const saveInventory = async () => {
        setSubmitted(true)

        if (inventory.productId && inventory.storageAddressId && inventory.quantity > 0) {
            let _inventories = [...inventories]
            try {
                const isUpdating = !!inventory.id
                const response = await fetch(isUpdating ? `/api/product-inventory/${inventory.id}` : "/api/product-inventory", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: inventory.productId,
                        storageAddressId: inventory.storageAddressId,
                        quantity: inventory.quantity,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar inventário"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _inventories.push(result)
                } else {
                    const index = _inventories.findIndex((i) => i.id === inventory.id)
                    _inventories[index] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Inventário atualizado com sucesso" : "Inventário criado com sucesso",
                    life: 3000,
                })

                setInventories(_inventories)
                setInventoryDialog(false)
                setInventory({
                    id: "",
                    productId: "",
                    storageAddressId: "",
                    quantity: 0,
                    status: "UNPROCESSED",
                    createdAt: "",
                    updatedAt: "",
                    product: {
                        code: "",
                        description: "",
                    },
                    storageAddress: {
                        address: "",
                    },
                })
            } catch (error) {
                console.error("Erro ao salvar inventário:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar inventário"
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage,
                    life: 4000,
                })
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

    const editInventory = (inventory: Inventory) => {
        setInventory({ ...inventory })
        setInventoryDialog(true)
    }

    const deleteInventory = async (inventory: Inventory) => {
        try {
            const response = await fetch(`/api/product-inventory/${inventory.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                let _inventories = inventories.filter((val) => val.id !== inventory.id)
                setInventories(_inventories)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Inventário deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar inventário")
            }
        } catch (error) {
            console.error("Erro ao deletar inventário:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar inventário", life: 3000 })
        }
    }

    const processInventories = async () => {
        try {
            const response = await fetch("/api/product-inventory/process", {
                method: "POST",
            })

            if (response.ok) {
                const data = await response.json()
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: data.message, life: 3000 })
                fetchInventories()
            } else {
                throw new Error("Erro ao processar inventários")
            }
        } catch (error) {
            console.error("Erro ao processar inventários:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao processar inventários", life: 3000 })
        }
    }

    const inventoryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-primary" onClick={saveInventory} />
        </>
    )

    const onRowSelect = (e: any) => {
        setInventory(e.data)
        setInventoryDialog(true)
    }

    const statusBodyTemplate = (rowData: Inventory) => {
        const statusLabel = rowData.status === "PROCESSED" ? "Processado" : "Não Processado"
        return <span className={`p-tag p-tag-${rowData.status === "PROCESSED" ? "success" : "warning"}`}>{statusLabel}</span>
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <Toast ref={toast} />
                <ConfirmDialog />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <DataTable value={inventories} paginator rows={10} className="datatable-custom" onRowSelect={onRowSelect}>
                            <Column field="product.code" header="Código do Produto" />
                            <Column field="product.description" header="Descrição do Produto" />
                            <Column field="storageAddress.address" header="Endereço" />
                            <Column field="quantity" header="Quantidade" />
                            <Column field="status" header="Status" body={statusBodyTemplate} />
                            <Column
                                body={(rowData: Inventory) => (
                                    <>
                                        <Button
                                            icon="pi pi-pencil"
                                            style={{
                                                borderRadius: "300px",
                                            }}
                                            className="p-button-rounded p-button-success"
                                            onClick={() => editInventory(rowData)}
                                            disabled={rowData.status === "PROCESSED"}
                                        />
                                        <DeleteButton
                                            item={rowData}
                                            disabled={rowData.status === "PROCESSED"}
                                            onDelete={deleteInventory}
                                            message={`Você tem certeza que deseja deletar o Produto ${rowData.product.description}?`}
                                            header="Confirmação"
                                        />
                                    </>
                                )}
                            />
                        </DataTable>
                    )}
                    <Dialog
                        className="p-fluid"
                        visible={inventoryDialog}
                        style={{ width: "450px" }}
                        header="Inventário"
                        modal
                        footer={inventoryDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="product">Produto</label>
                            <Dropdown
                                id="product"
                                value={inventory.productId}
                                options={productOptions}
                                onChange={(e) => setInventory({ ...inventory, productId: e.value })}
                                placeholder="Selecione um produto"
                            />
                        </div>
                        <div className="field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="storageAddress">Endereço</label>
                            <Dropdown
                                id="storageAddress"
                                value={inventory.storageAddressId}
                                options={storageAddressOptions}
                                onChange={(e) => setInventory({ ...inventory, storageAddressId: e.value })}
                                placeholder="Selecione um endereço"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">Quantidade</label>
                            <InputText
                                id="quantity"
                                type="number"
                                value={inventory.quantity.toString()}
                                onChange={(e) => setInventory({ ...inventory, quantity: Number(e.target.value) })}
                            />
                        </div>
                    </Dialog>
                    <ConfirmDialog
                        draggable={false}
                        visible={visible}
                        accept={processInventories}
                        icon="pi pi-exclamation-triangle"
                        acceptClassName="p-button-danger"
                        acceptLabel="Sim"
                        rejectClassName="p-button-secondary"
                        rejectLabel="Não"
                        onHide={() => {
                            setVisible(false)
                        }}
                        header="Atenção"
                        message="Deseja processar o inventário? Após processado não será possível estornar o saldo"
                    />
                </div>
            </div>
        </>
    )
}
