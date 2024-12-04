import { cn } from "@/lib/utils"

interface DateSelectorProps {
  dates: Array<{
    day: number
    month: string
    weekday: string
    isSelected?: boolean
  }>
}

export function DateSelector({ dates }: DateSelectorProps) {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {dates.map((date) => (
        <button
          key={date.day}
          className={cn(
            "flex flex-col items-center min-w-[72px] p-3 rounded-2xl transition-colors",
            date.isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-accent"
          )}
        >
          <span className="text-sm font-medium">{date.month}</span>
          <span className="text-2xl font-bold">{date.day}</span>
          <span className="text-sm">{date.weekday}</span>
        </button>
      ))}
    </div>
  )
}
