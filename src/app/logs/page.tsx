"use client"

import Navbar from "@/components/Navbar"
import "primeicons/primeicons.css"
import { Column } from "primereact/column"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { useEffect, useRef, useState } from "react"
import styles from "./../page.module.css"
import { Toolbar } from "primereact/toolbar"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type Log = {
    id: string
    action: string
    type: string
    userId: string
    createdAt: Date
    updatedAt: Date
    user: {
        id: string
        username: string
    }
}

export default function Logs() {
    const [loading, setLoading] = useState<boolean>(true)
    const [logs, setLogs] = useState<Log[]>([])
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        action: { value: null, matchMode: "contains" },
        type: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
    })
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const response = await fetch("/api/logs", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setLogs(data)
        } catch (error) {
            console.error("Erro ao buscar logs:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar logs",
                life: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

    const LogBadge: React.FC<any> = ({ type }) => {
        const getBadgeStyle = (type: string) => {
            switch (type) {
                case "CREATE":
                    return { backgroundColor: "#4caf50", color: "#fff" }
                case "UPDATE":
                    return { backgroundColor: "#ff9800", color: "#fff" }
                case "DELETE":
                    return { backgroundColor: "#f44336", color: "#fff" }
                case "LIST":
                    return { backgroundColor: "#2196f3", color: "#fff" }
                default:
                    return { backgroundColor: "#9e9e9e", color: "#fff" }
            }
        }

        return (
            <span
                style={{
                    padding: "0.5em 1em",
                    borderRadius: "1em",
                    display: "inline-block",
                    ...getBadgeStyle(type),
                }}
            >
                {type}
            </span>
        )
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Relatório de Logs de Ações", 14, 22)

        const pdfData = logs.map((log) => [
            log.user.username,
            log.action,
            log.type,
            new Date(log.createdAt).toLocaleDateString(),
            new Date(log.updatedAt).toLocaleDateString(),
        ])

        const headers = ["Usuário", "Ação", "Tipo", "Data de Criação", "Data de Atualização"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("relatorio_logs_acoes.pdf")
    }

    const exportToExcel = () => {
        const excelData = logs.map((log) => ({
            Usuário: log.user.username,
            Ação: log.action,
            Tipo: log.type,
            "Data de Criação": new Date(log.createdAt).toLocaleDateString(),
            "Data de Atualização": new Date(log.updatedAt).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logs de Ações")

        XLSX.writeFile(workbook, "relatorio_logs_acoes.xlsx")
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

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4 p-toolbar" right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    header="Logs"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={logs}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column align="center" field="action" header="Ação" sortable></Column>
                    <Column align="center" field="type" body={(rowData) => <LogBadge type={rowData.type} />} header="Tipo" sortable></Column>
                    <Column align="center" field="user.username" header="Usuário" sortable></Column>
                    <Column
                        align="center"
                        field="createdAt"
                        header="Data de Criação"
                        body={(rowData) => {
                            const date = new Date(rowData.createdAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                        }}
                        sortable
                    ></Column>
                    <Column
                        align="center"
                        field="updatedAt"
                        header="Data de Atualização"
                        body={(rowData) => {
                            const date = new Date(rowData.updatedAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                        }}
                        sortable
                    ></Column>
                </DataTable>
            </div>
        </>
    )
}
