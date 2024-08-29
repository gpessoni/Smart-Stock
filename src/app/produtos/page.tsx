"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "primereact/skeleton"
import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import Navbar from "@/components/Navbar"
import styles from "./../page.module.css"
import { Column } from "primereact/column"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import "primeicons/primeicons.css"
import { Toolbar } from "primereact/toolbar"
import DeleteButton from "@/components/Forms/DeleteButton"

type Product = {
    id: string | null
    code: string
    description: string
    typeProductId: string | null
    groupProductId: string | null
    unitOfMeasureId: string | null
    createdAt?: Date
    updatedAt?: Date
    ProductStorageBalances: any | null
}

type DropdownOption = {
    label: string
    value: string
}

export default function Products() {
    const [loading, setLoading] = useState<boolean>(true)
    const [products, setProducts] = useState<Product[]>([])
    const [productDialog, setProductDialog] = useState<boolean>(false)
    const [product, setProduct] = useState<Product>({
        id: null,
        code: "",
        description: "",
        typeProductId: null,
        groupProductId: null,
        unitOfMeasureId: null,
        ProductStorageBalances: null,
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [typeProductOptions, setTypeProductOptions] = useState<DropdownOption[]>([])
    const [groupProductOptions, setGroupProductOptions] = useState<DropdownOption[]>([])
    const [unitMeasureOptions, setUnitMeasureOptions] = useState<DropdownOption[]>([])

    const [visible, setVisible] = useState(false)
    const toast = useRef<Toast>(null)

    useEffect(() => {
        fetchProducts()
        fetchDropdownOptions()
        setLoading(false)
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error("Erro ao buscar produtos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar produtos", life: 3000 })
        }
    }

    const fetchDropdownOptions = async () => {
        try {
            const [typeProducts, groupProducts, unitMeasures] = await Promise.all([
                fetch("/api/product-types").then((res) => res.json()),
                fetch("/api/product-groups").then((res) => res.json()),
                fetch("/api/unit-measure").then((res) => res.json()),
            ])

            setTypeProductOptions(typeProducts.map((tp: any) => ({ label: tp.description, value: tp.id })))
            setGroupProductOptions(groupProducts.map((gp: any) => ({ label: gp.description, value: gp.id })))
            setUnitMeasureOptions(unitMeasures.map((um: any) => ({ label: um.description, value: um.id })))
        } catch (error) {
            console.error("Erro ao buscar opções de dropdown:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar opções", life: 3000 })
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
        setProduct({ id: null, code: "", description: "", typeProductId: null, groupProductId: null, unitOfMeasureId: null, ProductStorageBalances: null })
        setSubmitted(false)
        setProductDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setProductDialog(false)
    }

    const saveProduct = async () => {
        setSubmitted(true)

        if (product.code.trim() && product.description.trim() && product.typeProductId && product.groupProductId && product.unitOfMeasureId) {
            let _products = [...products]
            try {
                console.log("Payload enviado:", JSON.stringify(product))

                const isUpdating = !!product.id
                const response = await fetch(isUpdating ? `/api/products/${product.id}` : "/api/products", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: product.code,
                        description: product.description,
                        typeProductId: product.typeProductId,
                        groupProductId: product.groupProductId,
                        unitOfMeasureId: product.unitOfMeasureId,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar produto"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _products.push(result)
                } else {
                    const index = _products.findIndex((p) => p.id === product.id)
                    _products[index] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Produto atualizado com sucesso" : "Produto criado com sucesso",
                    life: 3000,
                })

                setProducts(_products)
                setProductDialog(false)
                setProduct({
                    id: null,
                    code: "",
                    description: "",
                    typeProductId: null,
                    groupProductId: null,
                    unitOfMeasureId: null,
                    ProductStorageBalances: null,
                })
            } catch (error) {
                console.error("Erro ao salvar produto:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar produto"
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

    const editProduct = (product: Product) => {
        console.log(product)
        setProduct({ ...product })
        setProductDialog(true)
    }

    const deleteProduct = async (product: Product) => {
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                let _products = products.filter((val) => val.id !== product.id)
                setProducts(_products)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Produto deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar produto")
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar produto", life: 3000 })
        }
    }

    const viewBalances = (product: Product) => {
        setProduct(product)
        setVisible(true)
    }

    const calculateTotalBalance = (balances: any[]) => {
        if (!balances) return 0
        return balances.reduce((total, item) => total + item.balance, 0)
    }

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
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
                    header="Produtos"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={products}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column field="code" header="Código"></Column>
                    <Column field="description" header="Descrição"></Column>
                    <Column field="typeProduct.description" header="Tipo de Produto"></Column>
                    <Column field="groupProduct.description" header="Grupo de Produto"></Column>
                    <Column field="unitOfMeasure.description" header="Unidade de Medida"></Column>
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
                        header="Ações"
                        body={(rowData) => {
                            return (
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button
                                        icon="pi pi-list"
                                        value="Ver Saldos"
                                        style={{
                                            marginRight: "15px",
                                        }}
                                        className="p-button-rounded p-button-info"
                                        onClick={() => viewBalances(rowData)}
                                    />
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deleteProduct}
                                        message={`Você tem certeza que deseja deletar o Produto ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            )
                        }}
                    ></Column>
                </DataTable>
                <Dialog
                    visible={productDialog}
                    style={{
                        width: "40vw",
                    }}
                    header="Produto"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="code" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Código
                        </label>
                        <InputText id="code" value={product.code} onChange={(e) => setProduct({ ...product, code: e.target.value })} required />
                        {submitted && !product.code && <small className="p-invalid">Código é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="description" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Descrição
                        </label>
                        <InputText
                            id="description"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            required
                        />
                        {submitted && !product.description && <small className="p-invalid">Descrição é obrigatória.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="typeProductId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Tipo de Produto
                        </label>
                        <Dropdown
                            id="typeProductId"
                            value={product.typeProductId}
                            options={typeProductOptions}
                            onChange={(e) => setProduct({ ...product, typeProductId: e.value })}
                            placeholder="Selecione o Tipo de Produto"
                        />
                        {submitted && !product.typeProductId && <small className="p-invalid">Tipo de Produto é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="groupProductId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Grupo de Produto
                        </label>
                        <Dropdown
                            id="groupProductId"
                            value={product.groupProductId}
                            options={groupProductOptions}
                            onChange={(e) => setProduct({ ...product, groupProductId: e.value })}
                            placeholder="Selecione o Grupo de Produto"
                        />
                        {submitted && !product.groupProductId && <small className="p-invalid">Grupo de Produto é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="unitOfMeasureId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Unidade de Medida
                        </label>
                        <Dropdown
                            id="unitOfMeasureId"
                            value={product.unitOfMeasureId}
                            options={unitMeasureOptions}
                            onChange={(e) => setProduct({ ...product, unitOfMeasureId: e.value })}
                            placeholder="Selecione a Unidade de Medida"
                        />
                        {submitted && !product.unitOfMeasureId && <small className="p-invalid">Unidade de Medida é obrigatória.</small>}
                    </div>
                </Dialog>

                <Dialog header={"Saldos do Produto  " + product.description} visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
                    <h3>Saldo Total: {calculateTotalBalance(product.ProductStorageBalances)}</h3>
                    {product && (
                        <div>
                            <DataTable value={product.ProductStorageBalances} responsiveLayout="scroll">
                                <Column field="storageAddress.address" header="Armazém"></Column>
                                <Column field="balance" header="Saldo"></Column>
                            </DataTable>
                        </div>
                    )}
                </Dialog>

                <ConfirmDialog />
            </div>
        </>
    )
}
