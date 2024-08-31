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

    useEffect(() => {
        fetchproductTypes()
        setLoading(false)
    }, [])

    const fetchproductTypes = async () => {
        try {
            const response = await fetch("/api/product-types")
            const data = await response.json()
            setproductTypes(data)
        } catch (error) {
            console.error("Erro ao buscar Tipos de Produtos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar Tipos de Produtos", life: 3000 })
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
        setproductType({ id: null, description: "" })
        setSubmitted(false)
        setproductTypeDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setproductTypeDialog(false)
    }

    const saveproductType = async () => {
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
                    _productTypes[_productTypes.findIndex((g) => g.id === productType.id)] = productType
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Tipos de Produto atualizado com sucesso" : "Tipos de Produto criado com sucesso",
                    life: 3000,
                })
                setproductTypes(_productTypes)
                setproductTypeDialog(false)
                setproductType({ id: null, description: "" })
            } catch (error) {
                console.error("Erro ao salvar Tipos de Produto:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Tipos de Produto"
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

    const editproductType = (productType: productTypeProduct) => {
        setproductType({ ...productType })
        setproductTypeDialog(true)
    }

    const deleteproductType = async (productType: productTypeProduct) => {
        try {
            const response = await fetch(`/api/product-types/${productType.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                let _productTypes = productTypes.filter((val) => val.id !== productType.id)
                setproductTypes(_productTypes)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Tipos de Produto deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar Tipos de Produto")
            }
        } catch (error) {
            console.error("Erro ao deletar Tipos de Produto:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar Tipos de Produto", life: 3000 })
        }
    }

    const productTypeDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveproductType} />
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
                                        onDelete={deleteproductType}
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
