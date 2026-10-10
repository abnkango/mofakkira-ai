const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

const pad = (value: number) => String(value).padStart(2, '0')

export const formatNoteDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = arabicMonths[date.getMonth()]
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${day} ${month} ${time}`
}
