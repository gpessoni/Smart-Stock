"use client"

import AddressDialog from "@/components/Address/AddressDialog "
import DeleteButton from "@/components/Forms/DeleteButton"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import styles from "./../page.module.css"
import Navbar from "@/components/Navbar"

type Storage = {
    id: string | null
    code: string | null
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function Storages() {
    const [loading, setLoading] = useState<boolean>(true)
    const [storages, setstorages] = useState<Storage[]>([])
    const [storageDialog, setstorageDialog] = useState<boolean>(false)
    const [selectedStorageId, setSelectedStorageId] = useState<string | null>(null)
    const [addressDialogVisible, setAddressDialogVisible] = useState<boolean>(false)

    const [storage, setstorage] = useState<Storage>({
        id: null,
        code: "",
        description: "",
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
        updatedAt: { value: null, matchMode: "contains" },
    })

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchstorages()
        setLoading(false)
    }, [])

    const fetchstorages = async () => {
        try {
            const response = await fetch("/api/storages", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setstorages(data)
        } catch (error) {
            console.error("Erro ao buscar Armazéns:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar Armazéns", life: 3000 })
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <InputText
                    id="globalFilter"
                    placeholder="Pesquisar"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, global: { value: e.target.value, matchMode: "contains" } })}
                    className="ml-2"
                />
            </div>
        )
    }

    const openAddressDialog = (storageId: string) => {
        setSelectedStorageId(storageId)
        setAddressDialogVisible(true)
    }

    const openNew = () => {
        const nextCode = String(storages.length + 2).padStart(2, "0")
        setstorage({ id: null, code: nextCode, description: "" })
        setstorageDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setstorageDialog(false)
    }

    const savestorage = async () => {
        setSubmitted(true)

        if (storage.description.trim()) {
            let _storages = [...storages]
            try {
                const isUpdating = !!storage.id
                const response = await fetch(isUpdating ? `/api/storages/${storage.id}` : "/api/storages", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ code: storage.code, description: storage.description }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Armazém"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _storages.push(result)
                } else {
                    _storages[_storages.findIndex((g) => g.id === storage.id)] = storage
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Armazém atualizado com sucesso" : "Armazém criado com sucesso",
                    life: 3000,
                })
                setstorages(_storages)
                setstorageDialog(false)
                setstorage({ id: null, code: "", description: "" })
            } catch (error) {
                console.error("Erro ao salvar Armazém:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Armazém"
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

    const editstorage = (storage: Storage) => {
        setstorage({ ...storage })
        setstorageDialog(true)
    }

    const deletestorage = async (storage: Storage) => {
        try {
            const response = await fetch(`/api/storages/${storage.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })

            if (response.ok) {
                let _storages = storages.filter((val) => val.id !== storage.id)
                setstorages(_storages)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Armazém deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar Armazém")
            }
        } catch (error) {
            console.error("Erro ao deletar Armazém:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar Armazém", life: 3000 })
        }
    }

    const storageDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={savestorage} />
        </>
    )

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    header="Armazéns"
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={storages}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column align="center" field="code" header="Código" sortable></Column>
                    <Column align="center" field="description" header="Descrição" sortable></Column>
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
                        align="center"
                        body={(rowData: Storage) => (
                            <>
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button
                                        label="Endereços"
                                        icon="pi pi-map-marker"
                                        className="p-button-rounded p-button-info mr-2"
                                        onClick={() => openAddressDialog(rowData.id!)}
                                    />

                                    <Button
                                        icon="pi pi-pencil"
                                        style={{
                                            marginLeft: 10,
                                        }}
                                        className="p-button-rounded p-button-success mr-2"
                                        onClick={() => editstorage(rowData)}
                                    />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deletestorage}
                                        message={`Você tem certeza que deseja deletar o Armazém ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={storageDialog}
                    style={{ width: "450px" }}
                    header="Armazém"
                    draggable={false}
                    modal
                    className="p-fluid"
                    footer={storageDialogFooter}
                    onHide={hideDialog}
                >
                    <div
                        className="field"
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <label htmlFor="description">Código</label>
                        <InputText
                            id="description"
                            value={storage.code}
                            onChange={(e) => setstorage({ ...storage, code: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !storage.code ? "p-invalid" : ""}
                        />
                    </div>

                    <div
                        className="field"
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <label htmlFor="description">Descrição</label>
                        <InputText
                            id="description"
                            value={storage.description}
                            onChange={(e) => setstorage({ ...storage, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !storage.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog draggable={false} />

                <AddressDialog storageId={selectedStorageId!} visible={addressDialogVisible} onHide={() => setAddressDialogVisible(false)} />
            </div>
        </>
    )
}
