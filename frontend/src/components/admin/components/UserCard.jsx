import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const UserCard = ({ user }) => {
  const { t } = useLocale()
  return (
    <div className="card bg-base-100 shadow-sm w-full">
      <div className="card-body">
        {user ? (
          <>
            <h2 className="card-title">
              {t("adminPanel.userDetails.detailsCard.title")}
            </h2>
            <p>
              <strong>
                {`${t("adminPanel.userDetails.detailsCard.username")}: `}
              </strong>
              {user.username}
            </p>
            <p>
              <strong>
                {`${t("adminPanel.userDetails.detailsCard.email")}: `}
              </strong>{" "}
              {user.email}
            </p>
            <p>
              <strong>
                {`${t("adminPanel.userDetails.detailsCard.role")}: `}
              </strong>{" "}
              {user.role}
            </p>
            <p>
              <strong>
                {`${t("adminPanel.userDetails.detailsCard.balance")}: `}
              </strong>
              {user.balance}
            </p>
          </>
        ) : (
          <h3 className="text-center text-lg">
            {t("adminPanel.userDetails.detailsCard.noUser")}
          </h3>
        )}
      </div>
    </div>
  )
}

export default UserCard
