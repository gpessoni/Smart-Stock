"use client"
import styles from "./page.module.css"

export default function TermoUso() {
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src="https://cdn-icons-png.flaticon.com/512/4947/4947506.png" alt="Logo" width={50} height={50} />
                <h2>SmartStock</h2>
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>Termos de Uso</h1>
                <div className={styles.separator}></div>
                <br />
                <br />
                <p>
                    <span className={styles.text}>
                        O <strong>SmartStock</strong> é um sistema de gerenciamento de estoque desenvolvido com foco na simplicidade, eficiência e custo
                        acessível, sem comprometer a funcionalidade e a integridade dos dados. Ao utilizar os serviços do SmartStock, o usuário concorda com os
                        seguintes termos de uso:
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Confidencialidade das Informações:</strong> Todas as informações relacionadas ao estoque e operações gerenciadas através do
                        SmartStock são consideradas confidenciais. O usuário se compromete a não divulgar, compartilhar ou espalhar essas informações a
                        terceiros sem autorização. O sistema adota medidas rigorosas de segurança para proteger os dados e garantir sua integridade.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Auditoria e Monitoramento:</strong> O SmartStock realiza auditorias contínuas e monitoramento das operações realizadas na
                        plataforma. Todos os acessos e alterações nos dados são registrados para garantir a transparência e a integridade das informações. O
                        usuário concorda com a coleta e análise desses registros para manter a qualidade e a segurança do serviço.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Objetivos do Sistema:</strong> O SmartStock visa oferecer uma plataforma intuitiva e completa para a gestão de estoque,
                        especialmente voltada para pequenas e médias empresas. O sistema proporciona controle eficiente, redução de erros e otimização dos
                        processos operacionais.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Funcionalidades:</strong> O SmartStock inclui funcionalidades como gerenciamento de produtos (categorização por tipo, grupo e
                        unidade de medida), gestão de endereços de armazenamento, registro e processamento de inventários, criação de solicitações de estoque, e
                        transferência de produtos entre diferentes endereços. Essas funcionalidades visam otimizar a movimentação e o controle de produtos no
                        almoxarifado.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Responsabilidade do Usuário:</strong> O usuário é responsável por manter a confidencialidade de suas credenciais de acesso e por
                        todas as atividades realizadas através de sua conta. Qualquer uso não autorizado da conta ou violação de segurança deve ser
                        imediatamente reportado ao SmartStock.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Limitação de Responsabilidade:</strong> O SmartStock não se responsabiliza por quaisquer danos diretos, indiretos, acidentais,
                        consequenciais ou especiais que possam surgir em decorrência do uso ou da incapacidade de uso da plataforma, incluindo, mas não se
                        limitando a, perda de dados, lucros cessantes ou interrupção dos negócios.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Propriedade Intelectual:</strong> Todos os direitos de propriedade intelectual relacionados ao SmartStock, incluindo software,
                        logos, e materiais de marketing, são de propriedade exclusiva do SmartStock ou de seus licenciadores. O usuário não deve copiar,
                        modificar, ou distribuir qualquer parte do sistema sem autorização expressa.
                    </span>
                    <br />
                    <br />
                </p>
                <p>
                    <span className={styles.text}>
                        <strong>Modificações nos Termos de Uso:</strong> O SmartStock se reserva o direito de modificar estes termos de uso a qualquer momento,
                        sem aviso prévio. O uso contínuo do sistema após qualquer modificação constitui a aceitação das alterações.
                    </span>
                    <br />
                    <br />
                </p>
            </div>
        </div>
    )
}
