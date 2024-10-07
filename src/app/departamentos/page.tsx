"use client"

import DeleteButton from "@/components/Forms/DeleteButton"
import Navbar from "@/components/Navbar"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputSwitch } from "primereact/inputswitch"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { SetStateAction, useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"
import styles from "./../page.module.css"

type Department = {
    id: string
    description: string
    createdAt?: Date
    updatedAt?: Date
}

interface Permission {
    id: string
    description: string
}

export default function Departments() {
    const [loading, setLoading] = useState<boolean>(true)
    const [departments, setDepartments] = useState<Department[]>([])
    const [departmentDialog, setDepartmentDialog] = useState<boolean>(false)
    const [department, setDepartment] = useState<Department>({ id: "", description: "" })
    const [submitted, setSubmitted] = useState<boolean>(false)

    const [permissionsDialog, setPermissionsDialog] = useState<boolean>(false)
    const [allPermissions, setAllPermissions] = useState<Permission[]>([])
    const [departmentPermissions, setDepartmentPermissions] = useState<string[]>([])
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("")

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
        updatedAt: { value: null, matchMode: "contains" },
    })
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    const fetchDepartments = async () => {
        try {
            const response = await fetch("/api/departments", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data: Department[] = await response.json()
            setDepartments(data)
        } catch (error) {
            console.error("Erro ao buscar Departamentos:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar Departamentos",
                life: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    const handleNewDepartment = () => {
        setDepartment({ id: "", description: "" })
        setSubmitted(false)
        setDepartmentDialog(true)
    }

    const handleEditDepartment = (department: Department) => {
        setDepartment(department)
        setDepartmentDialog(true)
    }

    const renderPermissionSwitch = (permissionId: string) => {
        const isAssigned = departmentPermissions.includes(permissionId)

        return <InputSwitch checked={isAssigned} onChange={(e) => handlePermissionToggle(permissionId, e.value)} />
    }

    const fetchPermissions = async (departmentId: SetStateAction<string>) => {
        try {
            const [allPermissionsRes, departmentPermissionsRes] = await Promise.all([
                fetch("/api/permissions", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }),
                fetch(`/api/departments/permissions/${departmentId}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }),
            ])

            const allPermissionsData = await allPermissionsRes.json()
            const departmentPermissionsData = await departmentPermissionsRes.json()

            setAllPermissions(allPermissionsData)
            setDepartmentPermissions(departmentPermissionsData?.map((perm: { id: string }) => perm.id))
            setPermissionsDialog(true)
        } catch (error) {
            console.error("Erro ao buscar permissões:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar permissões",
                life: 3000,
            })
        }
    }

    const openPermissionsDialog = (departmentId: Department) => {
        setSelectedDepartmentId(departmentId.id)
        fetchPermissions(departmentId.id)
    }

    const saveDepartment = async () => {
        setSubmitted(true)
        if (department.description.trim()) {
            try {
                const method = department.id ? "PUT" : "POST"
                const url = department.id ? `/api/departments/${department.id}` : "/api/departments"
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ description: department.description }),
                })

                if (!response.ok) throw new Error("Erro ao salvar Departamento")

                const updatedDepartment = await response.json()
                setDepartments((prev) =>
                    department.id ? prev.map((dep) => (dep.id === department.id ? updatedDepartment : dep)) : [...prev, updatedDepartment]
                )

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: department.id ? "Departamento atualizado" : "Departamento criado",
                    life: 3000,
                })

                setDepartmentDialog(false)
                setDepartment({ id: "", description: "" })
            } catch (error) {
                console.error("Erro ao salvar Departamento:", error)
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao salvar Departamento",
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

    const deleteDepartment = async (department: Department) => {
        try {
            const response = await fetch(`/api/departments/${department.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            if (!response.ok) throw new Error("Erro ao deletar Departamento")

            setDepartments((prev) => prev.filter((dep) => dep.id !== department.id))
            toast.current?.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Departamento deletado com sucesso",
                life: 3000,
            })
        } catch (error) {
            console.error("Erro ao deletar Departamento:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao deletar Departamento",
                life: 3000,
            })
        }
    }

    const handlePermissionToggle = async (permissionId: string, isChecked: boolean) => {
        try {
            const method = isChecked ? "POST" : "DELETE"
            const response = await fetch(`/api/departments/permissions`, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuthToken()}` },
                body: JSON.stringify({ departmentId: selectedDepartmentId, permissionId }),
            })

            if (!response.ok) throw new Error("Erro ao atualizar permissão")

            setDepartmentPermissions((prev) => (isChecked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)))

            toast.current?.show({
                severity: "success",
                summary: "Sucesso",
                detail: `Permissão ${isChecked ? "adicionada" : "removida"} com sucesso`,
                life: 3000,
            })
        } catch (error) {
            console.error("Erro ao atualizar permissão:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao atualizar permissão", life: 3000 })
        }
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Relatório de Departamentos", 14, 22)

        const pdfData = departments.map((department) => [
            department.description,
            new Date(department.createdAt!).toLocaleDateString(),
            new Date(department.updatedAt!).toLocaleDateString(),
        ])

        const headers = ["Descrição", "Data de Criação", "Data de Atualização"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("relatorio_departamentos.pdf")
    }

    const exportToExcel = () => {
        const excelData = departments.map((department) => ({
            Descrição: department.description,
            "Data de Criação": new Date(department.createdAt!).toLocaleDateString(),
            "Data de Atualização": new Date(department.updatedAt!).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Departamentos")

        XLSX.writeFile(workbook, "relatorio_departamentos.xlsx")
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
                <Button
                    label="Exportar Excel"
                    icon="pi pi-file-excel"
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        outline: "none",
                        color: "#007bff",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                    }}
                    className="p-button-info"
                    onClick={exportToExcel}
                />
                <Button
                    label="Exportar PDF"
                    icon="pi pi-file-pdf"
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        outline: "none",
                        color: "#dc3545",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                    }}
                    className="p-button-danger"
                    onClick={exportToPDF}
                />
            </div>
        )
    }

    const departmentDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => setDepartmentDialog(false)} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveDepartment} />
        </>
    )

    const permissionsDialogFooter = (
        <>
            <Button label="Fechar" icon="pi pi-times" className="p-button-danger" onClick={() => setPermissionsDialog(false)} />
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
                <Toolbar
                    className="p-mb-4 p-toolbar"
                    left={() => <Button label="Novo" icon="pi pi-user-plus" className="p-button-success" onClick={handleNewDepartment} />}
                    right={rightToolbarTemplate}
                />

                <DataTable
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    header="Departamentos"
                    value={departments}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                    style={{ width: "100%", overflow: "auto", border: "1px solid #ccc" }}
                >
                    <Column align="center" field="description" header="Descrição" sortable />
                    <Column
                        align="center"
                        field="createdAt"
                        header="Data de Criação"
                        body={({ createdAt }) => new Date(createdAt!).toLocaleDateString()}
                        sortable
                    />
                    <Column
                        align="center"
                        field="updatedAt"
                        header="Data de Atualização"
                        body={({ updatedAt }) => new Date(updatedAt!).toLocaleDateString()}
                        sortable
                    />
                    <Column
                        align="center"
                        body={(rowData: Department) => (
                            <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => handleEditDepartment(rowData)} />
                                <Button
                                    icon="pi pi-lock"
                                    style={{
                                        marginLeft: "15px",
                                    }}
                                    className="p-button-rounded p-button-info ml-2"
                                    onClick={() => openPermissionsDialog(rowData)}
                                />
                                <DeleteButton
                                    item={rowData}
                                    onDelete={deleteDepartment}
                                    message={`Você tem certeza que deseja deletar o Departamento ${rowData.description}?`}
                                    header="Confirmação"
                                />
                            </div>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={departmentDialog}
                    style={{ width: "450px" }}
                    header={department.id ? "Editar Departamento" : "Novo Departamento"}
                    modal
                    onHide={() => setDepartmentDialog(false)}
                    footer={departmentDialogFooter}
                >
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText
                                id="description"
                                value={department.description}
                                onChange={(e) => setDepartment((prev) => ({ ...prev, description: e.target.value }))}
                                required
                                autoFocus
                                className={submitted && !department.description.trim() ? "p-invalid" : ""}
                            />
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={permissionsDialog}
                    style={{ width: "1000px" }}
                    header="Gerenciar Permissões"
                    modal
                    draggable={false}
                    onHide={() => setPermissionsDialog(false)}
                    footer={permissionsDialogFooter}
                >
                    <DataTable value={allPermissions} header="Permissões" style={{ width: "100%" }}>
                        <Column align="center" field="route" header="Rota" sortable></Column>
                        <Column align="center" field="description" header="Descrição" sortable></Column>
                        <Column
                            align="center"
                            field="createdAt"
                            header="Data de Criação"
                            body={({ createdAt }) => new Date(createdAt!).toLocaleDateString()}
                            sortable
                        />
                        <Column
                            align="center"
                            field="updatedAt"
                            header="Data de Atualização"
                            body={({ updatedAt }) => new Date(updatedAt!).toLocaleDateString()}
                            sortable
                        />
                        <Column header="Habilitar" body={(rowData) => renderPermissionSwitch(rowData.id)} />
                    </DataTable>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
