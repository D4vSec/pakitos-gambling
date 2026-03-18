import React, { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { FormField } from "@/components/forms/FormField"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import Title from "@/components/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import UserSVG from "@/components/svg/UserSVG"
import ShieldSVG from "@/components/svg/ShieldSVG"
import AlertTriangle from "@/components/svg/AlertTriangle"

const Profile = () => {
    const { user, updateProfile } = useSession()
    const { addNotification } = useNotification()

    const profileMethods = useForm({
        defaultValues: {
            username: "",
            email: "",
        },
    })

    const passwordMethods = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const newPasswordValue = passwordMethods.watch("newPassword")

    useEffect(() => {
        if (user) {
            profileMethods.reset({
                username: user?.username || "",
                email: user?.email || "",
            })
        }
    }, [user])

    const handleProfileSubmit = (data) => {
        console.log("Actualizar perfil:", data)
        // updateProfile(data)
    }

    const handlePasswordSubmit = (data) => {
        console.log("Cambiar contraseña:", data)
        // updateProfile(data)
        passwordMethods.reset()
    }

    const handleDeleteAccount = () => {
        console.log("Eliminar cuenta")
    }

    return (
        <GradientBg>
            <Title>Profile</Title>
            <div className="w-full max-w-5xl flex flex-col gap-6">
                {/* 🔵 PERFIL */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-xl">
                            <UserSVG />
                            Profile Information
                        </h2>
                        <p className="text-base-content mb-6">Update your personal information</p>

                        <div className="flex flex-col lg:flex-row  gap-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center  gap-4 ">
                                <div className="avatar">
                                    <div className="w-30 rounded-full ring ring-primary ring-offset-2">
                                        <img
                                            src={
                                                user?.avatar_url ||
                                                "https://www.alkain.com/DS-Contenido/ImageNotFound.jpg"
                                            }
                                            alt="avatar"
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    className="btn-sm"
                                    onClick={() => console.log("editando foto...")}
                                >
                                    Cambiar foto
                                </Button>
                            </div>

                            {/* Form */}
                            <div className="flex-1">
                                <FormProvider {...profileMethods}>
                                    <form
                                        onSubmit={profileMethods.handleSubmit(handleProfileSubmit)}
                                        className="flex flex-col gap-4"
                                    >
                                        <FormField
                                            name="username"
                                            type="text"
                                            label="Username"
                                            rules={{ required: "Required" }}
                                        />

                                        <FormField
                                            name="email"
                                            type="email"
                                            label="Email"
                                            rules={{ required: "Required" }}
                                        />

                                        <Button variant="primary" className="mt-2">
                                            Guardar cambios
                                        </Button>
                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🟡 SEGURIDAD */}
                <div className="card bg-base-100 shadow-xl border border-warning/30">
                    <div className="card-body">
                        <h2 className="card-title text-xl">
                            <ShieldSVG />
                            Security Settings
                        </h2>
                        <p className="text-base-content mb-6">Manage account security</p>

                        <FormProvider {...passwordMethods}>
                            <form
                                onSubmit={passwordMethods.handleSubmit(handlePasswordSubmit)}
                                className="flex flex-col gap-4"
                            >
                                <FormField
                                    name="currentPassword"
                                    type="password"
                                    label="Contraseña actual"
                                    rules={{ required: "Required" }}
                                />

                                <FormField
                                    name="newPassword"
                                    type="password"
                                    label="Nueva contraseña"
                                    rules={{
                                        required: "Required",
                                        minLength: { value: 8, message: "Min 8 caracteres" },
                                    }}
                                />

                                <FormField
                                    name="confirmPassword"
                                    type="password"
                                    label="Repetir nueva contraseña"
                                    rules={{
                                        validate: (value) =>
                                            value === newPasswordValue ||
                                            "Las contraseñas no coinciden",
                                    }}
                                />

                                <Button variant="secondary" className="mt-2">
                                    Cambiar contraseña
                                </Button>
                            </form>
                        </FormProvider>
                    </div>
                </div>

                {/* 🔴 DANGER ZONE */}
                <div className="card bg-base-100 shadow-xl border border-error">
                    <div className="card-body">
                        <h2 className="card-title text-error text-xl">
                            <AlertTriangle />
                            Danger Zone
                        </h2>

                        <p className="text-sm opacity-70">
                            Esta acción es irreversible. Se eliminarán todos tus datos.
                        </p>

                        <Button variant="error" className="mt-4" onClick={handleDeleteAccount}>
                            Eliminar cuenta
                        </Button>
                    </div>
                </div>
            </div>
        </GradientBg>
    )
}

export default Profile
