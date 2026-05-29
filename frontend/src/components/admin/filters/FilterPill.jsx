import { IconX } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"

const FilterPill = ({ label, value, onRemove, isEnum = false }) => {
  const { t } = useLocale()
  const displayValue =
    isEnum && typeof value === "string" ? value.toUpperCase() : value

  return (
    <div className="badge badge-primary h-auto py-1.5 px-2 md:px-3 gap-2 shadow-sm transition-all animate-in fade-in zoom-in duration-200 max-w-full flex items-center">
      <div className="flex flex-col md:flex-row md:items-center md:gap-1 min-w-0 overflow-hidden">
        <span className="font-bold text-[9px] md:text-[10px] uppercase opacity-70 whitespace-nowrap">
          {label}:
        </span>
        <span className="text-xs md:text-sm font-medium truncate max-w-30 md:max-w-62.5">
          {displayValue}
        </span>
      </div>

      <Button
        type="button"
        onClick={onRemove}
        unstyled
        className="shrink-0 p-0.5 hover:scale-125 transition-transform bg-primary-focus/20 rounded-full"
        title={t("ui.buttons.close")}>
        <IconX className="w-3 h-3 md:w-3.5 md:h-3.5" />
      </Button>
    </div>
  )
}

export default FilterPill
