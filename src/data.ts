import type { Folder, Note, Task } from './types'

export const seedFolders: Folder[] = [
  { id: 'work', name: 'العمل' },
  { id: 'ideas', name: 'أفكار' },
  { id: 'personal', name: 'شخصي' },
]

const now = new Date()
const daysAgo = (days: number, hour?: number, minute?: number) => {
  const date = new Date(now.getTime() - days * 86400000)
  if (hour !== undefined && minute !== undefined) date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export const seedNotes: Note[] = [
  { id: 'n1', title: 'خطة إطلاق المنتج', body: 'تجهيز صفحة الهبوط، مراجعة الرسائل الأساسية، وتنسيق موعد الإطلاق مع الفريق.', folderId: 'work', createdAt: daysAgo(8), updatedAt: daysAgo(1, 10, 15) },
  { id: 'n2', title: 'اجتماع فريق التصميم', body: 'نحتاج إلى توحيد ألوان الواجهة وتبسيط خطوة التسجيل قبل نهاية الأسبوع.', folderId: 'work', createdAt: daysAgo(6), updatedAt: daysAgo(2, 16, 40) },
  { id: 'n3', title: 'أفكار للمحتوى', body: 'سلسلة قصيرة عن تنظيم اليوم، قالب أسبوعي، وتجربة خلف الكواليس.', folderId: 'ideas', createdAt: daysAgo(5), updatedAt: daysAgo(2, 9, 5) },
  { id: 'n4', title: 'مقهى هادئ للعمل', body: 'قائمة بأماكن مريحة فيها إضاءة طبيعية وإنترنت جيد للاجتماعات الصباحية.', folderId: 'personal', createdAt: daysAgo(12), updatedAt: daysAgo(3, 13, 25) },
  { id: 'n5', title: 'قائمة قراءة الصيف', body: 'كتاب عن العادات، رواية قصيرة، ومقال طويل عن أثر المساحات الهادئة.', folderId: 'personal', createdAt: daysAgo(20), updatedAt: daysAgo(5, 18, 45) },
  { id: 'n6', title: 'ملاحظة سريعة', body: 'اسأل عن موعد الرحلة القادمة وتحقق من حالة الطقس قبل الحجز.', createdAt: daysAgo(2), updatedAt: daysAgo(0, 0, 5) },
  { id: 'n7', title: 'تحسين روتين الصباح', body: 'إبعاد الهاتف أول نصف ساعة، شرب الماء، وكتابة أهم مهمة لليوم.', folderId: 'ideas', createdAt: daysAgo(10), updatedAt: daysAgo(6, 7, 30) },
  { id: 'n8', title: 'مشتريات المنزل', body: 'مصابيح دافئة، نبات صغير للمكتب، ودفتر ملاحظات جديد.', createdAt: daysAgo(4), updatedAt: daysAgo(1, 21, 10) },
  { id: 'n9', title: 'رحلة مؤجلة', body: 'مقارنة الخيارات والعودة إلى الميزانية بعد الهدوء.', originalFolderId: 'personal', createdAt: daysAgo(28), updatedAt: daysAgo(24), deletedAt: daysAgo(4) },
  { id: 'n10', title: 'مسودة قديمة', body: 'أفكار لم تعد أولوية، يمكن الاحتفاظ بها للمراجعة لاحقاً.', folderId: 'ideas', originalFolderId: 'ideas', createdAt: daysAgo(40), updatedAt: daysAgo(38), deletedAt: daysAgo(31) },
]

export const seedTasks: Task[] = [
  { id: 't1', text: 'مراجعة صفحة الهبوط', done: false, createdAt: daysAgo(1) },
  { id: 't2', text: 'إرسال ملخص الاجتماع', done: false, createdAt: daysAgo(2) },
  { id: 't3', text: 'حجز موعد الطبيب', done: false, createdAt: daysAgo(3) },
  { id: 't4', text: 'شراء نبات للمكتب', done: true, createdAt: daysAgo(5) },
  { id: 't5', text: 'تحديث قائمة القراءة', done: true, createdAt: daysAgo(6) },
  { id: 't6', text: 'ترتيب ملفات المشروع', done: false, createdAt: daysAgo(7) },
]

export const daysRemaining = (iso: string) => Math.max(0, 30 - Math.floor((Date.now() - new Date(iso).getTime()) / 86400000))
