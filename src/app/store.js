import { configureStore } from '@reduxjs/toolkit'
import studentsReducer from '../features/students/studentsSlice'
import teachersReducer from '../features/teachers/teachersSlice'
import staffsReducer from '../features/staffs/staffsSlice'
import departmentsReducer from '../features/departments/departmentsSlice'
import levelsReducer from '../features/levels/levelsSlice'
import termsReducer from '../features/terms/termsSlice'
import contactReducer from '../features/contacts/contactsSlice'
import ordersReducer from '../features/orders/ordersSlice'
import productsReducer from '../features/products/productsSlice'
import ticketsReducer from '../features/tickets/ticketsSlice'
import templatesReducer from '../features/templatesSliders/templatesSlidersSlice'
import templateHeadersReducer from '../features/templateHeaders/templateHeadersSlice'
import templatesIndexCourseReducer from '../features/templatesIndexCourse/templatesIndexCourseSlice'
import templatesQuestionsReducer from '../features/templatesQuestions/templatesQuestionsSlice'
import templatesTournametsReducer from '../features/templatesTournaments/templatesTournamentsSlice'
import templatesTopStudentsReducer from '../features/templatesTopStudents/templatesTopStudentsSlice'
import aboutusReducer from '../features/aboutus/aboutusSlice'
import galleryFilesReducer from '../features/galleryFiles/galleryFilesSlice'
import classroomsReducer from '../features/classrooms/classroomsSlice'
import menuReducer from '../features/publicMenu/publicMenuSlice'
import submenuReducer from '../features/submenus/submenusSlice'

export const store = configureStore({
  reducer: {
    studentsR: studentsReducer,
    teachersR: teachersReducer,
    staffsR: staffsReducer,
    departmentsR: departmentsReducer,
    levelsR: levelsReducer,
    termsR: termsReducer,
    contactR: contactReducer,
    ordersR: ordersReducer,
    productsR: productsReducer,
    ticketsR: ticketsReducer,
    templatesR: templatesReducer,
    templateHeadersR: templateHeadersReducer,
    templatesIndexCourseR: templatesIndexCourseReducer,
    templatesQuestionsR: templatesQuestionsReducer,
    templatesTournamentsR: templatesTournametsReducer,
    templatesTopStudentsR: templatesTopStudentsReducer,
    aboutusR: aboutusReducer,
    galleryFilesR: galleryFilesReducer,
    classroomsR: classroomsReducer,
    menuR: menuReducer,
    subR: submenuReducer,
  },
})
