

export default function DetailedProfile() {

    const savedDataRaw = localStorage.getItem("user_Data");
    const savedData = savedDataRaw ? JSON.parse(savedDataRaw) : null;
    console.log(savedData);

    const profile = {
      name: savedData?.name || "N/A",
      employeeId: savedData?.employeeCode || "N/A",
      mobile: savedData?.mobile || "Not Provided",
      email: "amitgupta@gmail.com",
      department: savedData?.department || "N/A",
      role: "Asst. Professor",
      about: "",
    };
  
    return (
      <div className="min-h-screen bg-blue-100 flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
          {/* Profile Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 24 24" fill="black">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.1 0-9.4 1.6-9.4 4.9V22h18.8v-2.9c0-3.3-6.3-4.9-9.4-4.9z"/>
              </svg>
            </div>
          </div>
  
          {/* Profile Details */}
          <div className="space-y-2 text-gray-800">
            <p><strong>Name -</strong> {profile.name}</p>
            <p><strong>Employee id -</strong> {profile.employeeId}</p>
            <p><strong>Mobile No. -</strong> {profile.mobile}</p>
            <p><strong>Email -</strong> {profile.email}</p>
            <p><strong>Department -</strong> {profile.department}</p>
            <p><strong>Role -</strong> {profile.role}</p>
            <p><strong>About -</strong> {profile.about || "-"}</p>
          </div>
  
          {/* Edit Button */}
          <button className="mt-6 px-6 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded shadow">
            Edit Profile
          </button>
        </div>
      </div>
    );
  }
  