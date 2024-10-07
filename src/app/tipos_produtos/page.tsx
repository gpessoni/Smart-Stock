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
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"
import styles from "./../page.module.css"

type productTypeProduct = {
    id: string | null
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function productTypeProducts() {
    const [loading, setLoading] = useState<boolean>(true)
    const [productTypes, setproductTypes] = useState<productTypeProduct[]>([])
    const [productTypeDialog, setproductTypeDialog] = useState<boolean>(false)
    const [productType, setproductType] = useState<productTypeProduct>({
        id: null,
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
        fetchProductTypes()
        setLoading(false)
    }, [])

    const fetchProductTypes = async () => {
        try {
            const response = await fetch("/api/product-types", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setproductTypes(data)
        } catch (error) {
            console.error("Erro ao buscar Tipos de Produtos:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar Tipos de Produtos",
                life: 3000,
            })
        }
    }

    const openNew = () => {
        setproductType({ id: null, description: "" })
        setSubmitted(false)
        setproductTypeDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setproductTypeDialog(false)
    }

    const saveProductType = async () => {
        setSubmitted(true)

        if (productType.description.trim()) {
            let _productTypes = [...productTypes]
            try {
                console.log("Payload enviado:", JSON.stringify(productType))

                const isUpdating = !!productType.id
                const response = await fetch(isUpdating ? `/api/product-types/${productType.id}` : "/api/product-types", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({ description: productType.description }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Tipos de Produto"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _productTypes.push(result)
                } else {
                    _productTypes[_productTypes.findIndex((pt) => pt.id === productType.id)] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Tipo de Produto atualizado com sucesso" : "Tipo de Produto criado com sucesso",
                    life: 3000,
                })
                setproductTypes(_productTypes)
                setproductTypeDialog(false)
                setproductType({ id: null, description: "" })
            } catch (error) {
                console.error("Erro ao salvar Tipo de Produto:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Tipo de Produto"
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

    const editproductType = (productType: productTypeProduct) => {
        setproductType({ ...productType })
        setproductTypeDialog(true)
    }

    const deleteProductType = async (productType: productTypeProduct) => {
        try {
            const response = await fetch(`/api/product-types/${productType.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })

            if (response.ok) {
                let _productTypes = productTypes.filter((val) => val.id !== productType.id)
                setproductTypes(_productTypes)
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Tipo de Produto deletado com sucesso",
                    life: 3000,
                })
            } else {
                throw new Error("Erro ao deletar Tipo de Produto")
            }
        } catch (error) {
            console.error("Erro ao deletar Tipo de Produto:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao deletar Tipo de Produto",
                life: 3000,
            })
        }
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Relatório de Unidades de Medida", 14, 22)

        const pdfData = productTypes.map((group) => [
            group.description,
            new Date(group.createdAt!).toLocaleDateString(),
            new Date(group.updatedAt!).toLocaleDateString(),
        ])

        const headers = ["Descrição", "Data de Criação", "Data de Atualização"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("relatorio_unidades_medida.pdf")
    }

    const exportToExcel = () => {
        const excelData = productTypes.map((group) => ({
            Descrição: group.description,
            "Data de Criação": new Date(group.createdAt!).toLocaleDateString(),
            "Data de Atualização": new Date(group.updatedAt!).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Unidades de Medida")

        XLSX.writeFile(workbook, "relatorio_unidades_medida.xlsx")
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

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
            </div>
        )
    }

    const productTypeDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveProductType} />
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
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    header="Tipos de Produtos"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={productTypes}
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
                        body={(rowData: productTypeProduct) => (
                            <>
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editproductType(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deleteProductType}
                                        message={`Você tem certeza que deseja deletar o Tipos de Produto ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={productTypeDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Tipos de Produto"
                    modal
                    className="p-fluid"
                    footer={productTypeDialogFooter}
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
                            value={productType.description}
                            onChange={(e) => setproductType({ ...productType, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !productType.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
