import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // imports bootstrap styles
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom"; // for routing functionality

// these import the different components
import Login from "./pages/LoginPage/login";
import Landing from "./pages/LandingPage/landing";
import EmployeeHome from "./pages/EmployeeDashboard/employeeHome";
import ProjManagerHome from "./pages/ProjectManagerDashboard/projManagerHome";
import HrManagerHome from "./pages/HRManagerDashboard/HrManagerHome";
import SuperAdminHome from "./pages/SuperAdminDashboard/superAdminHome";
import EmployeeTasksPage from "./pages/EmployeeGoalPage/Tasks";
import ProjectManagerOwnGoals from "./pages/ProjManagerGoalPage/ownTasks";
import EmployeeAnalytics from "./pages/EmployeeAnalyticsPage/AnalyticsEmployee";
import EmployeeFeedback from "./pages/EmployeeFeedbackPage/FeedbackEmployee";
import CustomizeFeedbackForm from "./pages/CustomizeFormsPage/customizeFeedbackForm";
import ProjectManagerEvaluationForm from "./pages/ProjManagerEvaluationForm/projEvalForm";
import HRManagerEvaluationForm from "./pages/HRManagerEvaluationForm/hrEvalForm";
import ProjManagerAnalytics from "./pages/ProjManagerAnalyticsPage/projManagerAnalytics";
import ManageTeam from "./pages/HRManagerManageTeamPage/HrManagerManageTeam";
import ViewTeamProgress from "./components/TeamProgress/teamProgress";

const organizationalObjectives = [
  "Increase overall revenue",
  "Increase customer satisfaction",
  "Increase product quality",
  "Improve customer support",
  "Identify potential partners",
  "Increase market share",
  "Increase brand awareness",
  "Improve employee satisfaction",
];

const goalPercentageIncrease = [
  "Increase by 15%",
  "Increase by 10%",
  "Increase by 10%",
  "Increase by 10%",
  "Increase by 20%",
  "Increase by 12%",
  "Increase by 10%",
  "Increase by 30%",
];

function App() {
  return (
    // set up BrowserRouter to manage routing in the application, and define the routes
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employeeHome" element={<EmployeeHome />} />
        <Route
          path="/projManagerHome"
          element={
            <ProjManagerHome
              organizationalObjectives={organizationalObjectives}
              goalPercentageIncrease={goalPercentageIncrease}
            />
          }
        />
        <Route
          path="/HrManagerHome"
          element={
            <HrManagerHome
              organizationalObjectives={organizationalObjectives}
              goalPercentageIncrease={goalPercentageIncrease}
            />
          }
        />
        <Route path="/superAdminHome" element={<SuperAdminHome />} />
        <Route path="/employeeTasks" element={<EmployeeTasksPage />} />
        <Route
          path="/projectManagerTasks"
          element={<ProjectManagerOwnGoals />}
        />
        <Route path="/employeeAnalytics" element={<EmployeeAnalytics />} />
        <Route path="/employeeFeedback" element={<EmployeeFeedback />} />
        <Route
          path="/customizeFeedbackForm"
          element={<CustomizeFeedbackForm />}
        />
        <Route path="/viewTeamProgress" element={<ViewTeamProgress />}></Route>
        <Route path="/HRManageTeam" element={<ManageTeam />} />
        <Route
          path="/projManagerEvaluationForm"
          element={<ProjectManagerEvaluationForm />}
        ></Route>
        <Route
          path="/hrManagerEvaluationForm"
          element={<HRManagerEvaluationForm />}
        ></Route>
        <Route
          path="/projManagerAnalytics"
          element={<ProjManagerAnalytics />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

// this exports the App component to be used as the main entry point of the application
export default App;
