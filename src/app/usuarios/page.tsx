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
import { InputSwitch } from "primereact/inputswitch"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import styles from "./../page.module.css"

type Department = {
    id: string
    description: string
}

type User = {
    id: string
    username: string
    password?: string
    department: Department
    createdAt?: Date
    updatedAt?: Date
}

export default function Users() {
    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<User[]>([])
    const [departments, setDepartments] = useState<Department[]>([]) // Novo estado para armazenar os departamentos
    const [userDialog, setUserDialog] = useState<boolean>(false)
    const [user, setUser] = useState<User>({
        id: "",
        username: "",
        department: {} as Department,
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    const [permissionsDialog, setPermissionsDialog] = useState(false)
    const [allPermissions, setAllPermissions] = useState([])
    const [departmentPermissions, setDepartmentPermissions] = useState<string[]>([])

    useEffect(() => {
        fetchUsers()
        fetchDepartments()
        setLoading(false)
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    const fetchUsers = async () => {
        try {
            const authToken = getAuthToken()
            const response = await fetch("/api/users", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Erro ao buscar usuários:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar usuários", life: 3000 })
        }
    }

    const fetchDepartments = async () => {
        try {
            const authToken = getAuthToken()
            const response = await fetch("/api/departments", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            const data = await response.json()
            setDepartments(data)
        } catch (error) {
            console.error("Erro ao buscar departamentos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar departamentos", life: 3000 })
        }
    }

    const fetchPermissions = async (userId: string) => {
        try {
            const authToken = getAuthToken()
            const [allPermissionsRes, departmentPermissionsRes] = await Promise.all([
                fetch("/api/permissions", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }),
                fetch(`/api/users/permissions/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }),
            ])

            const allPermissionsData = await allPermissionsRes.json()
            const departmentPermissionsData = await departmentPermissionsRes.json()

            setAllPermissions(allPermissionsData)
            setDepartmentPermissions(departmentPermissionsData.map((perm: { id: string }) => perm.id))
            setPermissionsDialog(true)
        } catch (error) {
            console.error("Erro ao buscar permissões:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar permissões", life: 3000 })
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
            </div>
        )
    }

    const openPermissionsDialog = (userId: User) => {
        setUser(userId)
        fetchPermissions(userId.id)
    }

    const openNew = () => {
        setUser({ id: "", username: "", department: {} as Department })
        setSubmitted(false)
        setUserDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setUserDialog(false)
    }

    const saveUser = async () => {
        setSubmitted(true)

        if (user.username.trim() && user.department) {
            let _users = [...users]
            try {
                const authToken = getAuthToken()
                const userJSON = {
                    username: user.username,
                    userId: user.department.id,
                    password: user.password,
                }

                const isUpdating = !!user.id
                const response = await fetch(isUpdating ? `/api/users/${user.id}` : "/api/users", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(userJSON),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar usuário"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _users.push(result)
                } else {
                    const index = _users.findIndex((u) => u.id === user.id)
                    const userReturn = {
                        id: user.id,
                        username: user.username,
                        department: user.department,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt,
                    }
                    _users[index] = userReturn
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso",
                    life: 3000,
                })

                setUsers(_users)
                setUserDialog(false)
                setUser({
                    id: "",
                    username: "",
                    department: {} as Department,
                })
            } catch (error) {
                console.error("Erro ao salvar usuário:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar usuário"
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

    const editUser = (user: User) => {
        setUser({
            id: user.id ?? null,
            username: user.username ?? null,
            department: user.department ?? "",
        })
        setUserDialog(true)
    }

    const deleteUser = async (user: User) => {
        try {
            const authToken = getAuthToken()
            const response = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })

            if (response.ok) {
                let _users = users.filter((val) => val.id !== user.id)
                setUsers(_users)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Usuário deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar usuário")
            }
        } catch (error) {
            console.error("Erro ao deletar usuário:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar usuário", life: 3000 })
        }
    }

    const handlePermissionToggle = async (permissionId: string, isChecked: boolean) => {
        try {
            const authToken = getAuthToken()
            const method = isChecked ? "POST" : "DELETE"
            const response = await fetch(`/api/users/permissions`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ userId: user.id, permissionId }),
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

    const renderPermissionSwitch = (userId: string) => {
        const isAssigned = departmentPermissions.includes(userId)

        return <InputSwitch checked={isAssigned} onChange={(e) => handlePermissionToggle(userId, e.value)} />
    }

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveUser} />
        </>
    )

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

    const permissionsDialogFooter = (
        <>
            <Button label="Fechar" icon="pi pi-times" className="p-button-danger" onClick={() => setPermissionsDialog(false)} />
        </>
    )
    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate}></Toolbar>
                <DataTable
                    header="Usuários"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={users}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column field="username" header="Nome de Usuário"></Column>
                    <Column field="department.description" header="Função"></Column>
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
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />
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
                                        onDelete={deleteUser}
                                        message={`Você tem certeza que deseja deletar o usuário ${rowData.username}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            )
                        }}
                    ></Column>
                </DataTable>
                <Dialog visible={userDialog} style={{ width: "40vw" }} header="Usuário" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                    <div className="p-field" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="username">Nome de Usuário</label>
                        <InputText
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            required
                            autoFocus
                            className={submitted && !user.username ? "p-invalid" : ""}
                        />
                        {submitted && !user.username && <small className="p-error">Nome de usuário é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1rem" }}>
                        <label htmlFor="department">Função</label>
                        <Dropdown
                            id="department"
                            value={user.department}
                            options={departments}
                            onChange={(e) => setUser({ ...user, department: e.value })}
                            optionLabel="description"
                            placeholder="Selecione uma função"
                            required
                            className={submitted && !user.department ? "p-invalid" : ""}
                        />
                        {submitted && !user.department && <small className="p-error">Função é obrigatória.</small>}
                    </div>

                    {!user.id && (
                        <div className="p-field" style={{ marginBottom: "1rem" }}>
                            <label htmlFor="password">Senha</label>
                            <Password
                                id="password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                required
                                toggleMask
                                feedback={false}
                                className={submitted && !user.password ? "p-invalid" : ""}
                            />
                            {submitted && !user.password && <small className="p-error">Senha é obrigatória.</small>}
                        </div>
                    )}
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
