"use client"

import { useState, useRef } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import Image from "next/image"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import styles from "./page.module.css"

export default function Home() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const toast = useRef<any>(null)

    const handleLogin = async () => {
        try {
            const response = await fetch("/api/users/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            if (!response.ok) {
                throw new Error("Falha ao fazer login")
            }

            const data = await response.json()
            const { token } = data

            if (token) {
                localStorage.setItem("authToken", token)
                window.location.href = "/produtos"
            } else {
                showError("Token de autenticação não recebido")
            }
        } catch (error: any) {
            showError(error.message)
        }
    }

    const showError = (message: string) => {
        toast.current?.show({ severity: "error", summary: "Erro", detail: message })
    }

    return (
        <div className={styles.loginContainer}>
            <Toast ref={toast} />
            <div className={styles.logoContainer}>
                <Image src="https://cdn-icons-png.flaticon.com/512/4947/4947506.png" alt="Logo" width={50} height={50} />
                <h2>SmartStock</h2>
            </div>
            <div className={styles.formContainer}>
                <span className="p-float-label" style={{ marginTop: "1rem" }}>
                    <InputText
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <label htmlFor="username">Username</label>
                </span>
                <span className="p-float-label" style={{ marginTop: "3rem" }}>
                    <InputText
                        style={{
                            width: "100%",
                        }}
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                </span>
                <Button label="Login" icon="pi pi-check" onClick={handleLogin} className={styles.loginButton} style={{ marginTop: "2rem" }} />
            </div>

            <div className={styles.linksContainer}>
                <a href="/termos_uso" className={styles.link}>
                    Ver os termos de uso
                </a>
            </div>
        </div>
    )
}
