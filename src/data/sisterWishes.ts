import { SisterWishReason, MilestoneCounter, KeepsakeCertificate } from '../types';

export const sisterReasons: SisterWishReason[] = [
  {
    id: 'reason-1',
    title: 'القلب الأبيض والنقاء',
    description: 'تسامحكِ وروحكِ الطيبة تجعل وجودكِ بلسماً وشعاع طمأنينة لكل من حولكِ.',
    iconName: 'Heart',
    badge: 'نقاء فطري',
  },
  {
    id: 'reason-2',
    title: 'الضحكة التي تضيء الأيام',
    description: 'في أصعب اللحظات، ابتسامتكِ وحدها قادرة على تبديد القلق ونشر الأمل والسرور.',
    iconName: 'Smile',
    badge: 'بهجة دائمة',
  },
  {
    id: 'reason-3',
    title: 'السند والحكمة',
    description: 'رأيكِ السديد دائماً حاضر بهدوء وبصيرة، ووجودكِ يمنح العائلة ركيزة فخر واطمئنان.',
    iconName: 'Shield',
    badge: 'رأي حكيم',
  },
  {
    id: 'reason-4',
    title: 'الذوق واللطافة العالية',
    description: 'لمساتكِ الرقيقة وأسلوبكِ الراقي يتركان أثراً لا يُنسى في كل مكان تحلين فيه.',
    iconName: 'Sparkles',
    badge: 'أناقة الروح',
  },
  {
    id: 'reason-5',
    title: 'العطاء المتفاني بلا مقابل',
    description: 'قلبكِ الكبير الذي يتسع للجميع وحرصكِ الصادق على سعادة من تحبين دون انتظار مقابل.',
    iconName: 'Sun',
    badge: 'عطاء لا ينضب',
  },
  {
    id: 'reason-6',
    title: 'الأخت والصديقة وسر الأمان',
    description: 'القرب الروحي العميق الذي يجعل الحديث معكِ راحة نفسية وملاذاً دافئاً لا يعوض.',
    iconName: 'Star',
    badge: 'صديقة العمر',
  },
];

export const milestoneCounters: MilestoneCounter[] = [
  {
    id: 'counter-days',
    number: '365',
    label: 'يوماً قادماً',
    sublabel: 'من الأفراح والتوفيق المتجدد بإذن الله',
    iconName: 'Calendar',
  },
  {
    id: 'counter-love',
    number: '∞',
    label: 'محبة وفخر',
    sublabel: 'أخوة صادقة لا تنتهي بمرور السنين',
    iconName: 'HeartHandshake',
  },
  {
    id: 'counter-memories',
    number: '8',
    label: 'محطات مصوّرة',
    sublabel: 'توثق أياماً جميلة وما زال للقادم أجمل',
    iconName: 'Camera',
  },
  {
    id: 'counter-sister',
    number: '1',
    label: 'أخت استثنائية',
    sublabel: 'لا يضاهي مكانتها أحد في الكون',
    iconName: 'Crown',
  },
];

export const keepsakeCertificate: KeepsakeCertificate = {
  title: 'وسام الأخت الأفضل في العالم',
  subtitle: 'وثيقة محبة واعتزاز أخوي خالدة',
  recipientName: 'هديل',
  awardedBy: 'أخوكِ شهاب',
  date: 'يوم ميلادكِ السعيد ✨',
  declaration:
    'تُمنح هذه الشهادة المذهبة للأخت الغالية هديل، تقديراً لقلبها الصافي النابض بالخير، وابتسامتها التي تُعيد إشراق الحياة، وحضورها البهي الذي يملأ قلوبنا فخراً واعتزازاً في كل يوم. دمتِ نجوماً تضيء سماءنا، وسنداً محفوراً بالمحبة في قلوبنا.',
  sealText: 'ختم المحبة والوفاء الأخوي • شهاب وهديل',
};
