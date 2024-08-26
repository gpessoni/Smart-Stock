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

type Department = {
    id: string | null
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function Departments() {
    const [loading, setLoading] = useState<boolean>(true)
    const [departments, setdepartments] = useState<Department[]>([])
    const [departmentDialog, setdepartmentDialog] = useState<boolean>(false)
    const [department, setdepartment] = useState<Department>({
        id: null,
        description: "",
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        fetchdepartments()
        setLoading(false)
    }, [])

    const fetchdepartments = async () => {
        try {
            const response = await fetch("/api/departments")
            const data = await response.json()
            setdepartments(data)
        } catch (error) {
            console.error("Erro ao buscar Departamentos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar Departamentos", life: 3000 })
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
        setdepartment({ id: null, description: "" })
        setSubmitted(false)
        setdepartmentDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setdepartmentDialog(false)
    }

    const savedepartment = async () => {
        setSubmitted(true)

        if (department.description.trim()) {
            let _departments = [...departments]
            try {
                console.log("Payload enviado:", JSON.stringify(department))

                const isUpdating = !!department.id
                const response = await fetch(isUpdating ? `/api/departments/${department.id}` : "/api/departments", {
                    method: isUpdating ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ description: department.description }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Departamento"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _departments.push(result)
                } else {
                    _departments[_departments.findIndex((g) => g.id === department.id)] = department
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Departamento atualizado com sucesso" : "Departamento criado com sucesso",
                    life: 3000,
                })
                setdepartments(_departments)
                setdepartmentDialog(false)
                setdepartment({ id: null, description: "" })
            } catch (error) {
                console.error("Erro ao salvar Departamento:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Departamento"
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

    const editdepartment = (department: Department) => {
        setdepartment({ ...department })
        setdepartmentDialog(true)
    }

    const deletedepartment = async (department: Department) => {
        try {
            const response = await fetch(`/api/departments/${department.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                let _departments = departments.filter((val) => val.id !== department.id)
                setdepartments(_departments)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Departamento deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar Departamento")
            }
        } catch (error) {
            console.error("Erro ao deletar Departamento:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar Departamento", life: 3000 })
        }
    }

    const departmentDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={savedepartment} />
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
                    header="Departamentos"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={departments}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
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
                        body={(rowData: Department) => (
                            <>
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editdepartment(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deletedepartment}
                                        message={`Você tem certeza que deseja deletar o Departamento ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={departmentDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Departamento"
                    draggable={false}
                    modal
                    className="p-fluid"
                    footer={departmentDialogFooter}
                    onHide={hideDialog}
                >
                    <div
                        className="field"
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <label htmlFor="description">Descrição</label>
                        <InputText
                            id="description"
                            value={department.description}
                            onChange={(e) => setdepartment({ ...department, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !department.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
