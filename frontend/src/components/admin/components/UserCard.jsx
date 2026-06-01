import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { IconCoinBitcoin } from "@tabler/icons-react"

const UserCard = ({ user }) => {
  const { t } = useLocale()
  return (
    <div className="card w-full bg-base-100 shadow-sm lg:h-fit">
      <div className="card-body gap-3 p-5 sm:p-6">
        {user ? (
          <>
            <h2 className="card-title text-xl sm:text-2xl">
              {t("adminPanel.userDetails.detailsCard.title")}
            </h2>
            <p className="wrap-break-word text-sm sm:text-base">
              <strong>{`${t("adminPanel.userDetails.detailsCard.username")}: `}</strong>
              {user.username}
            </p>
            <p className="wrap-break-word text-sm sm:text-base">
              <strong>{`${t("adminPanel.userDetails.detailsCard.email")}: `}</strong>{" "}
              {user.email}
            </p>
            <p className="wrap-break-word text-sm capitalize sm:text-base">
              <strong>{`${t("adminPanel.userDetails.detailsCard.role")}: `}</strong>{" "}
              {user.role}
            </p>
            <p className="wrap-break-word text-sm sm:text-base flex gap-1">
              <strong>
                {`${t("adminPanel.userDetails.detailsCard.balance")}: `}
              </strong>
              <span className="flex gap-1 items-center">
                {user.balance}
                <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
            </p>
          </>
        ) : (
          <h3 className="text-center text-lg sm:text-2xl font-semibold">
            {t("adminPanel.userDetails.detailsCard.noUser")}
          </h3>
        )}
      </div>
    </div>
  )
}

export default UserCard
