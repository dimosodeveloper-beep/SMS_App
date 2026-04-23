import { I18n } from "i18n-js";

const i18n = new I18n({
  en: {
    home: "Home",
    dashboard: "Dashboard",
    dashboard_title: "Dashboard",
    dashboard_description: "Management System",
    welcome: "Welcome",
    logout: "Logout",
    confirm_logout: "Do you want to logout?",
    yes: "YES",
    no: "NO",

    register_user: "Register User",
    create_class: "Create Class",
    create_stream: "Create Stream",
    create_student: "Create Student",
    create_teacher: "Create Teacher",
    create_timetable: "Create Timetable",
    create_event: "Create Events",
    create_grade: "Create Grade",

    change_to_english: "Change language to English?",
    change_to_swahili: "Change language to Swahili?",

    new_version: "New Version Available",
    update_required: "Please update the application.",
    download: "Download",
    later: "Later",

    management_system: "Management System",
    welcome_back: "Welcome Back",
    quick_actions: "Quick Actions",
    recent_activities: "Recent Activities",

    back: "Back",
    home_btn: "Home",
    login: "Login",
    welcome_btn: "Welcome",

    results: "Results",
    attendance: "Attendance",
    exams: "Exams",
    students: "Students",

    all_subjects: "All Subjects",
    add_subject: "Add Subject",
    teachers: "Teachers",
    timetable: "Timetable",
    all_events: "All Events",
    all_grades: "All Grades",
    view_reports: "View Reports",
    about_app: "About App",

    activity1: "New student registered in Form One.",
    activity2: "Mathematics exam results uploaded.",
    activity3: "Teacher meeting scheduled for tomorrow.",

    time1: "2 minutes ago",
    time2: "30 minutes ago",
    time3: "1 hour ago",
  },

  sw: {
    home: "Nyumbani",
    dashboard: "Dashibodi",
    dashboard_title: "Dashibodi",
    dashboard_description: "Mfumo wa Usimamizi",
    welcome: "Karibu",
    logout: "Toka",
    confirm_logout: "Unataka kutoka?",
    yes: "NDIO",
    no: "HAPANA",

    register_user: "Sajili Mtumiaji",
    create_class: "Tengeneza Darasa",
    create_stream: "Tengeneza Mkondo",
    create_student: "Tengeneza Mwanafunzi",
    create_teacher: "Tengeneza Mwalimu",
    create_timetable: "Ratiba",
    create_event: "Matukio",
    create_grade: "Tengeneza Daraja",

    change_to_english: "Badilisha lugha kwenda Kiingereza?",
    change_to_swahili: "Badilisha lugha kwenda Kiswahili?",

    new_version: "Toleo Jipya Linapatikana",
    update_required: "Tafadhali sasisha programu.",
    download: "Pakua",
    later: "Baadaye",

    management_system: "Mfumo wa Usimamizi",
    welcome_back: "Karibu Tena",
    quick_actions: "Vitendo vya Haraka",
    recent_activities: "Shughuli za Hivi Karibuni",

    back: "Rudi",
    home_btn: "Nyumbani",
    login: "Ingia",
    welcome_btn: "Karibu",

    results: "Matokeo",
    attendance: "Mahudhurio",
    exams: "Mitihani",
    students: "Wanafunzi",

    all_subjects: "Masomo Yote",
    add_subject: "Ongeza Somo",
    teachers: "Walimu",
    timetable: "Ratiba",
    all_events: "Matukio Yote",
    all_grades: "Madaraja Yote",
    view_reports: "Angalia Ripoti",
    about_app: "Kuhusu App",

    activity1: "Mwanafunzi mpya amesajiliwa Form One.",
    activity2: "Matokeo ya hisabati yamepakiwa.",
    activity3: "Mkutano wa walimu umepangwa kesho.",

    time1: "Dakika 2 zilizopita",
    time2: "Dakika 30 zilizopita",
    time3: "Saa 1 iliyopita",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;