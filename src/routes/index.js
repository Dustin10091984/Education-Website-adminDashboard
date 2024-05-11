import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login'
import UIMain from '../pages/ui/UIMain'
import PublicMenu from '../pages/publicMenu/PublicMenu'
import Dpages from '../pages/dpages/Dpages'
import Students from '../pages/students/Students'
import AdminDashboard from '../pages/adminDashboard/AdminDashboard'
import Landing from '../pages/landing/Landing'
import EditStudentForm from '../pages/students/EditStudentForm'
import EditTeacherForm from '../pages/teachers/EditTeacherForm'
import RequestedStudentDetails from '../pages/students/RequestedStudentDetails'
import RegisterStudentOnsite from '../pages/students/RegisterStudentOnsite'
import Teachers from '../pages/teachers/Teachers'
import RegisterTeacherOnsite from '../pages/teachers/RegisterTeacherOnsite'
import Staffs from '../pages/staffs/Staffs'
import EditStaffForm from '../pages/staffs/EditStaffForm'
import RegisterStaffOnsite from '../pages/staffs/RegisterStaffOnsite'
import Departments from '../pages/departments/Departments'
import EditDepartmentForm from '../pages/departments/EditDepartmentForm'
import AddDepartment from '../pages/departments/AddDepartment'
import Levels from '../pages/levels/Levels'
import EditLevelForm from '../pages/levels/EditLevelForm'
import AddLevel from '../pages/levels/AddLevel'
import Terms from '../pages/terms/Terms'
import EditTermForm from '../pages/terms/EditTermForm'
import AddTerm from '../pages/terms/AddTerm'
import Contacts from '../pages/contacts/Contacts'
import Error from '../pages/error/Error'
import Classrooms from '../pages/classrooms/Classrooms'
import Orders from '../pages/orders/Orders'
import EditOrderForm from '../pages/orders/EditOrderForm'
import AddOrder from '../pages/orders/AddOrder'
import Products from '../pages/products/Products'
import ProductDetail from '../pages/products/ProductDetail'
import EditProductForm from '../pages/products/EditProductForm'
import AddProduct from '../pages/products/AddProduct'
import Tickets from '../pages/tickets/Tickets'
import TicketDetails from '../pages/tickets/TicketDetails'
import TemplateHeaders from '../pages/templateHeaders/TemplateHeaders'
import TemplatesSliders from '../pages/templatesSliders/TemplatesSliders'
import EditTemplateSliderForm from '../pages/templatesSliders/EditTemplateSlidersForm'
import AddTemplatesSliders from '../pages/templatesSliders/AddTemplatesSliders'
import EditTemplateHeadersForm from '../pages/templateHeaders/EditTemplateHeadersForm'
import AddTemplatesHeaders from '../pages/templateHeaders/AddTemplatesHeaders'
import TemplatesIndexCourse from '../pages/templatesIndexCourse/TemplatesIndexCourse'
import EditTemplateIndexCourseForm from '../pages/templatesIndexCourse/EditTemplateIndexCourseForm'
import AddTemplatesIndexCourse from '../pages/templatesIndexCourse/AddTemplatesIndexCourse'
import TemplatesQuestions from '../pages/templatesQuestions/TemplatesQuestions'
import EditTemplateQuestionsForm from '../pages/templatesQuestions/EditTemplateQuestionsForm'
import AddTemplatesQuestions from '../pages/templatesQuestions/AddTemplatesQuestions'
import TemplatesTournaments from '../pages/templatesTournaments/TemplatesTournaments'
import EditTemplateTournamentsForm from '../pages/templatesTournaments/EditTemplateTournamentsForm'
import TemplatesTopStudents from '../pages/templatesTopStudents/TemplatesTopStudents'
import AddTemplatesTournaments from '../pages/templatesTournaments/AddTemplatesTournaments'
import AddTemplatesTopStudents from '../pages/templatesTopStudents/AddTemplatesTopStudents'
import Reports from '../pages/reports/Reports'
import ContactDetails from '../pages/contacts/ContactDetails'
import Aboutus from '../pages/aboutus/Aboutus'
import GalleryFiles from '../pages/galleryFiles/GalleryFiles'
import EditGalleryFileForm from '../pages/galleryFiles/EditGalleryFileForm'
import AddGalleryFiles from '../pages/galleryFiles/AddGalleryFiles'
import EditClassroomForm from '../pages/classrooms/EditClassroomForm'
import AddClassroom from '../pages/classrooms/AddClassroom'
import AddMenu from '../pages/publicMenu/AddMenu'
import EditMenuForm from '../pages/publicMenu/EditMenuForm'
import Submenus from '../pages/submenus/Submenus'
import SubmenusMainSection from '../components/submenus/SubmenusMainSection'
import AddSubmenu from '../pages/submenus/AddSubmenu'
import EditSubmenuForm from '../pages/submenus/EditSubmenuForm'
import EditDpageForm from '../pages/dpages/EditDpageForm'
import Ckeditortest from '../pages/Ckeditortest'

const Index = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/UIMain' element={<UIMain />} />
        <Route path='/Dpages' element={<Dpages />} />
        <Route path='/PublicMenu' element={<PublicMenu />} />

        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/students' element={<Students />} />
        <Route path='/edit-student/:studentId' element={<EditStudentForm />} />
        <Route
          path='requested-student-detail/:studentId'
          element={<RequestedStudentDetails />}
        />
        <Route
          path='/register-student-onsite'
          element={<RegisterStudentOnsite />}
        />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/edit-teacher/:teacherId' element={<EditTeacherForm />} />
        <Route
          path='/register-teacher-onsite'
          element={<RegisterTeacherOnsite />}
        />
        <Route path='/staffs' element={<Staffs />} />
        <Route path='/edit-staff/:staffId' element={<EditStaffForm />} />
        <Route
          path='/register-staff-onsite'
          element={<RegisterStaffOnsite />}
        />
        <Route path='/departments' element={<Departments />} />
        <Route
          path='/edit-department/:departmentId'
          element={<EditDepartmentForm />}
        />
        <Route path='/add-department' element={<AddDepartment />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/edit-level/:levelId' element={<EditLevelForm />} />
        <Route path='/add-level' element={<AddLevel />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/edit-term/:termId' element={<EditTermForm />} />
        <Route path='/add-term' element={<AddTerm />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/edit-order/:orderId' element={<EditOrderForm />} />
        <Route path='/add-order' element={<AddOrder />} />
        <Route path='/products' element={<Products />} />
        <Route path='/edit-product/:productId' element={<EditProductForm />} />
        <Route path='/add-order' element={<AddOrder />} />
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/tickets' element={<Tickets />} />
        <Route path='ticket-detail/:ticketId' element={<TicketDetails />} />
        <Route path='/templates-sliders' element={<TemplatesSliders />} />
        <Route
          path='/edit-template-slider/:templateId'
          element={<EditTemplateSliderForm />}
        />
        <Route path='/add-template-slider' element={<AddTemplatesSliders />} />
        <Route path='template-headers' element={<TemplateHeaders />} />
        <Route
          path='/edit-template-header/:templateId'
          element={<EditTemplateHeadersForm />}
        />
        <Route path='/add-template-header' element={<AddTemplatesHeaders />} />
        <Route
          path='/templates-indexcourse'
          element={<TemplatesIndexCourse />}
        />
        <Route
          path='/edit-template-indexcourse/:templateId'
          element={<EditTemplateIndexCourseForm />}
        />
        <Route
          path='/add-template-indexcourse'
          element={<AddTemplatesIndexCourse />}
        />
        <Route path='/templates-questions' element={<TemplatesQuestions />} />
        <Route
          path='/edit-template-question/:templateId'
          element={<EditTemplateQuestionsForm />}
        />
        <Route
          path='/add-template-question'
          element={<AddTemplatesQuestions />}
        />
        <Route
          path='/templates-tournaments'
          element={<TemplatesTournaments />}
        />
        <Route
          path='/edit-template-tournament/:templateId'
          element={<EditTemplateTournamentsForm />}
        />
        <Route
          path='/add-template-tournament'
          element={<AddTemplatesTournaments />}
        />
        <Route
          path='/templates-topstudents'
          element={<TemplatesTopStudents />}
        />
        <Route
          path='/add-template-topstudent'
          element={<AddTemplatesTopStudents />}
        />
        <Route path='/reports' element={<Reports />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='contact-detail/:contactId' element={<ContactDetails />} />
        <Route path='/aboutus' element={<Aboutus />} />
        <Route path='/edit-aboutus/:aboutusId' element={<Aboutus />} />
        <Route path='/galleryfiles' element={<GalleryFiles />} />
        <Route
          path='/edit-gallery-file/:galleryFileId'
          element={<EditGalleryFileForm />}
        />
        <Route path='/add-gallery-file' element={<AddGalleryFiles />} />
        <Route path='/classrooms' element={<Classrooms />} />
        <Route
          path='edit-classroom/:classroomId'
          element={<EditClassroomForm />}
        />
        <Route path='/add-classroom' element={<AddClassroom />} />
        <Route path='/add-menu' element={<AddMenu />} />
        <Route path='/edit-menu/:menuId' element={<EditMenuForm />} />
        <Route path='submenus' element={<Submenus />} />
        <Route path='/submenus/:menuId' element={<SubmenusMainSection />} />
        <Route path='/add-submenu' element={<AddSubmenu />} />
        <Route path='/edit-submenu/:menuId' element={<EditSubmenuForm />} />
        <Route path='/edit-dpage/:menuId' element={<EditDpageForm />} />
        <Route path='ckeditortest' element={<Ckeditortest />} />

        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Index
