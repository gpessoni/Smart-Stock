"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "primereact/skeleton"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import Navbar from "@/components/Navbar"
import styles from "./../page.module.css"
import { Column } from "primereact/column"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import "primeicons/primeicons.css"
import { Toolbar } from "primereact/toolbar"
import DeleteButton from "@/components/Forms/DeleteButton"

type Permission = {
    id: string | null
    route: string | null
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function permissions() {
    const [loading, setLoading] = useState<boolean>(true)
    const [permissions, setpermissions] = useState<Permission[]>([])
    const [permissionDialog, setpermissionDialog] = useState<boolean>(false)
    const [permission, setpermission] = useState<Permission>({
        id: null,
        route: "",
        description: "",
    })
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
        updatedAt: { value: null, matchMode: "contains" },
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        fetchPermissions()
        setLoading(false)
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    const fetchPermissions = async () => {
        try {
            const response = await fetch("/api/permissions", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setpermissions(data)
        } catch (error) {
            console.error("Erro ao buscar Permissões:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar Permissões",
                life: 3000,
            })
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

    const openNew = () => {
        setpermission({ id: null, route: "", description: "" })
        setSubmitted(false)
        setpermissionDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setpermissionDialog(false)
    }

    const savePermission = async () => {
        setSubmitted(true)

        if (permission.description.trim()) {
            let _permissions = [...permissions]
            try {
                console.log("Payload enviado:", JSON.stringify(permission))

                const isUpdating = !!permission.id
                const response = await fetch(isUpdating ? `/api/permissions/${permission.id}` : "/api/permissions", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ description: permission.description, route: permission.route }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Permissão"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _permissions.push(result)
                } else {
                    _permissions[_permissions.findIndex((p) => p.id === permission.id)] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Permissão atualizada com sucesso" : "Permissão criada com sucesso",
                    life: 3000,
                })
                setpermissions(_permissions)
                setpermissionDialog(false)
                setpermission({ id: null, route: "", description: "" })
            } catch (error) {
                console.error("Erro ao salvar Permissão:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Permissão"
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

    const editpermission = (permission: Permission) => {
        setpermission({ ...permission })
        setpermissionDialog(true)
    }

    const deletePermission = async (permission: Permission) => {
        try {
            const response = await fetch(`/api/permissions/${permission.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })

            if (response.ok) {
                let _permissions = permissions.filter((val) => val.id !== permission.id)
                setpermissions(_permissions)
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Permissão deletada com sucesso",
                    life: 3000,
                })
            } else {
                throw new Error("Erro ao deletar Permissão")
            }
        } catch (error) {
            console.error("Erro ao deletar Permissão:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao deletar Permissão",
                life: 3000,
            })
        }
    }

    const permissionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={savePermission} />
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
                    header="Permissões"
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={permissions}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column align="center" field="route" header="Rota" sortable></Column>
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
                        body={(rowData: Permission) => (
                            <>
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editpermission(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deletePermission}
                                        message={`Você tem certeza que deseja deletar o Permissão ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={permissionDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Permissão"
                    draggable={false}
                    modal
                    className="p-fluid"
                    footer={permissionDialogFooter}
                    onHide={hideDialog}
                >
                    <div
                        className="field"
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <label htmlFor="description">Rota</label>
                        <InputText
                            id="description"
                            value={permission.route}
                            onChange={(e) => setpermission({ ...permission, route: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !permission.route ? "p-invalid" : ""}
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
                            value={permission.description}
                            onChange={(e) => setpermission({ ...permission, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !permission.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
