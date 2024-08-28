"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "primereact/skeleton"
import { DataTable } from "primereact/datatable"
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

type GroupProduct = {
    id: string | null
    code: string
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function GroupProducts() {
    const [loading, setLoading] = useState<boolean>(true)
    const [groups, setGroups] = useState<GroupProduct[]>([])
    const [groupDialog, setGroupDialog] = useState<boolean>(false)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [group, setGroup] = useState<GroupProduct>({
        id: null,
        code: "",
        description: "",
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        fetchGroups()
        setLoading(false)
    }, [])

    const fetchGroups = async () => {
        try {
            const response = await fetch("/api/product-groups")
            const data = await response.json()
            setGroups(data)
        } catch (error) {
            console.error("Erro ao buscar grupos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar grupos", life: 3000 })
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
                <InputText id="code" placeholder="Pesquisar" className="ml-2" />
            </div>
        )
    }

    const openNew = () => {
        const nextCode = String(groups.length + 2).padStart(2, "0")
        setGroup({ id: null, code: nextCode, description: "" })
        setSubmitted(false)
        setGroupDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setGroupDialog(false)
    }

    const saveGroup = async () => {
        setSubmitted(true)

        if (group.code.trim() && group.description.trim()) {
            let _groups = [...groups]
            try {
                console.log("Payload enviado:", JSON.stringify(group))

                const isUpdating = !!group.id
                const response = await fetch(isUpdating ? `/api/product-groups/${group.id}` : "/api/product-groups", {
                    method: isUpdating ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(isUpdating ? group : { code: group.code, description: group.description }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar grupo"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _groups.push(result)
                } else {
                    _groups[_groups.findIndex((g) => g.id === group.id)] = group
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Grupo atualizado com sucesso" : "Grupo criado com sucesso",
                    life: 3000,
                })
                setGroups(_groups)
                setGroupDialog(false)
                setGroup({ id: null, code: "", description: "" })
            } catch (error) {
                console.error("Erro ao salvar grupo:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar grupo"
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

    const editGroup = (group: GroupProduct) => {
        setGroup({ ...group })
        setGroupDialog(true)
    }

    const deleteGroup = async (group: GroupProduct) => {
        try {
            const response = await fetch(`/api/product-groups/${group.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                let _groups = groups.filter((val) => val.id !== group.id)
                setGroups(_groups)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Grupo deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar grupo")
            }
        } catch (error) {
            console.error("Erro ao deletar grupo:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar grupo", life: 3000 })
        }
    }

    const groupDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveGroup} />
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
                    header="Grupos de Produtos"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={groups}
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
                        body={(rowData: GroupProduct) => (
                            <>
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editGroup(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deleteGroup}
                                        message={`Você tem certeza que deseja deletar o grupo ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={groupDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Grupo"
                    modal
                    className="p-fluid"
                    footer={groupDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="field">
                        <label htmlFor="code">Código</label>
                        <InputText
                            style={{
                                marginTop: "10px",
                            }}
                            id="code"
                            value={group.code}
                            onChange={(e) => setGroup({ ...group, code: e.target.value })}
                            required
                            autoFocus
                            className={submitted && !group.code ? "p-invalid" : ""}
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
                            value={group.description}
                            onChange={(e) => setGroup({ ...group, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !group.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
