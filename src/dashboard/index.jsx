import React, { useEffect, useState, useCallback } from 'react'
import AddResume from './components/AddResume'
import GlobalApi from '../../service/GlobalApi'
import ResumeCardItem from './components/ResumeCardItem'
import { useUser } from '@clerk/clerk-react'

function Dashboard() {
  const { user } = useUser() // ✅ inside component (correct)
  const [resumeList, setResumeList] = useState(null) // null = loading state
  const [loading, setLoading] = useState(false)

  const GetResumesList = useCallback(async () => {
    try {
      setLoading(true)
      // If a logged in user exists, fetch user-specific resumes,
      // otherwise fall back to all resumes (or empty array)
      if (user?.primaryEmailAddress?.emailAddress) {
        const resp = await GlobalApi.GetUserResume(user.primaryEmailAddress.emailAddress)
        setResumeList(resp?.data?.data || [])
      } else {
        const resp = await GlobalApi.GetAllResumes()
        setResumeList(resp?.data?.data || [])
      }
    } catch (err) {
      console.error('Resume Fetch Error:', err)
      setResumeList([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    // fetch when component mounts and whenever user changes
    GetResumesList()
  }, [GetResumesList])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">My Resume</h2>
          <p className="text-gray-300 mt-2">
            Start creating AI-powered resumes for your next job role
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg">
          {/* Pass refresh so AddResume can call it after create */}
          <AddResume refreshData={GetResumesList} />

          {loading && <div className="col-span-full text-center">Loading resumes...</div>}

          {Array.isArray(resumeList) && resumeList.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-300">No resumes yet — create one!</div>
          )}

          {Array.isArray(resumeList) &&
            resumeList.map((resume, index) => (
              <ResumeCardItem
                key={resume?.documentId ?? index}
                resume={resume}
                refreshData={GetResumesList}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
