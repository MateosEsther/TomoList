import PrivateSidebar from '../../components/PrivateSidebar/PrivateSidebar';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import styles from './ProfilePage.module.scss'


function ProfilePage() {
    return (
        <div className={styles.profilePage}>
            <PrivateSidebar />

            {/*Contenido principal.*/}
            <main className={styles.content}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Mi perfil</h1>

                        <p>
                            Gestiona tus datos personales y elige tu avatar dentro de TomoList.
                        </p>
                    </div>
                </header>

                {/*Tarjeta principal de perfil.*/}
                <section className={styles.profileCard}>
                    <div className={styles.profileIntro}>
                        <div className={styles.currentAvatar} aria-hidden="true">
                            E
                        </div>

                        <div>
                            <h2>Esther</h2>
                            <p>usuario@tomolist.com</p>
                        </div>
                    </div>

                    {/*Selector de avatares predefinidos.*/}
                    <section className={styles.avatarSection}>
                        <h3>Elige tu avatar</h3>

                        <p>
                            Aquí irán los avatares a elegir.
                        </p>

                        <div className={styles.avatarGrid}>
                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                    defaultChecked
                                />
                                <span aria-hidden="true">E</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">A</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">B</span>
                            </label>

                            <label className={styles.avatarOption}>
                                <input
                                    type="radio"
                                    name="avatar"
                                />
                                <span aria-hidden="true">C</span>
                            </label>
                        </div>
                    </section>

                    {/*Form de datos de usuario.*/}
                    <form className={styles.profileForm}>
                        <div className={styles.field}>
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                defaultValue="Esther"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                defaultValue="usuario@tomolist.com"
                            />
                        </div>

                        <PrimaryButton>Guardar cambios</PrimaryButton>
                    </form>
                </section>

                {/*Sección de seguridad.*/}
                <section className={styles.securityCard}>
                    <h2>Seguridad</h2>

                    <p>
                        Cambio de contraseña.
                    </p>

                    <button type="button" className={styles.secondaryButton}>
                        Cambiar contraseña
                    </button>
                </section>
            </main>
        </div>
    )
}

export default ProfilePage