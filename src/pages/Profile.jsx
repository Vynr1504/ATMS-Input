 import { 
  AccountCircle, 
  Person, 
  Badge, 
  Business, 
  Email, 
  Phone, 
  PersonPin,
  Info,
  Visibility,
  History,
  Key,
  Logout
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Profile({ setIsAuthenticated }) {
  // ✅ Load and parse user data
  const savedDataRaw = localStorage.getItem("user_Data");
  const savedData = savedDataRaw ? JSON.parse(savedDataRaw) : null;

  const user = {
    name: savedData?.name || "N/A",
    employeeId: savedData?.employeeCode || "N/A",
    mobile: savedData?.phone || "Not Provided",
    department: savedData?.department || "N/A",
    email: savedData?.email || "N/A",
    abbreviation: savedData?.abbreviation || "N/A",
    about: savedData?.about || "N/A",
    role: savedData?.role || "N/A",
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("saved_credentials");
    localStorage.removeItem("user_Data");
    setIsAuthenticated(false);
  };

  const userInfo = [
    { icon: Person, label: "Name", value: user.name },
    { icon: Badge, label: "Employee ID", value: user.employeeId },
    { icon: Business, label: "Department", value: user.department },
    { icon: PersonPin, label: "Role", value: user.role },
    { icon: Email, label: "Email", value: user.email },
    { icon: Phone, label: "Mobile", value: user.mobile },
    { icon: Info, label: "Abbreviation", value: user.abbreviation },
    { icon: Info, label: "Status", value: user.about }
  ];

  const actionButtons = [
    // {
    //   to: "/detailedprofile",
    //   icon: Visibility,
    //   label: "View Profile",
    //   color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    //   textColor: "text-white"
    // },
    {
      onClick: () => console.log("History clicked"),
      icon: History,
      label: "History",
      color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      textColor: "text-white"
    },
    {
      to: "/change-password",
      icon: Key,
      label: "Change Password",
      color: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      textColor: "text-white"
    },
    {
      onClick: handleLogout,
      icon: Logout,
      label: "Logout",
      color: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      textColor: "text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Profile Dashboard</h1>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Manage your profile and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <AccountCircle className="text-gray-600 text-4xl sm:text-5xl lg:text-6xl" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center sm:text-left text-white flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 truncate">{user.name}</h2>
                    <p className="text-blue-100 text-sm sm:text-base truncate">{user.role}</p>
                    <p className="text-blue-200 text-xs sm:text-sm mt-1 truncate">{user.department}</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Info className="text-blue-500 text-xl" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {userInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                        <info.icon className="text-blue-600 text-sm sm:text-base" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{info.label}</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-800 mt-1 break-all sm:break-words">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 sm:px-6 py-4 sm:py-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Quick Actions</h3>
                <p className="text-gray-300 text-xs sm:text-sm mt-1">Manage your account</p>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {actionButtons.map((button, index) => (
                    button.to ? (
                      <Link
                        key={index}
                        to={button.to}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${button.color} ${button.textColor} font-medium text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        <button.icon className="text-lg flex-shrink-0" />
                        <span className="truncate">{button.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={index}
                        onClick={button.onClick}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${button.color} ${button.textColor} font-medium text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        <button.icon className="text-lg flex-shrink-0" />
                        <span className="truncate">{button.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Account Status</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-green-50 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Profile Complete</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Last Login</span>
                    <span className="text-xs text-gray-600">Today</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-purple-50 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Account Type</span>
                    <span className="text-xs text-purple-600 font-medium">Faculty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
