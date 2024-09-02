"use client"

import { useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import Image from "next/image"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import styles from "./page.module.css"

export default function Home() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        console.log("Email:", email)
        console.log("Password:", password)
        window.location.href = "/produtos"
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.logoContainer}>
                <Image src="https://cdn-icons-png.flaticon.com/512/4947/4947506.png" alt="Logo" width={50} height={50} />
                <h2>SmartStock</h2>
            </div>
            <div className={styles.formContainer}>
                <span className="p-float-label" style={{ marginTop: "1rem" }}>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                        }}
                    />
                    <label htmlFor="email">Email</label>
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
                <a href="/forgot-password" className={styles.link}>
                    Esqueceu a senha?
                </a>
                <a href="/termos_uso" className={styles.link}>
                    Ver os termos de uso
                </a>
            </div>
        </div>
    )
}
