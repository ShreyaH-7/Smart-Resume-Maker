import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function Education() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {}
  const params = useParams()

  // ✅ Always start with a safe array
  const [educationalList, setEducationalList] = useState([
    { universityName: '', degree: '', major: '', startDate: '', endDate: '', description: '' }
  ])

  // ✅ Load data ONLY ONCE from resumeInfo
  useEffect(() => {
    if (resumeInfo && Array.isArray(resumeInfo.education) && resumeInfo.education.length > 0) {
      setEducationalList(resumeInfo.education.map(e => ({ ...e })))
    }
  }, [resumeInfo])

  const handleChange = (event, index) => {
    const { name, value } = event.target
    setEducationalList(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [name]: value }
      return copy
    })
  }

  const AddNewEducation = () => {
    setEducationalList(prev => [
      ...prev,
      { universityName: '', degree: '', major: '', startDate: '', endDate: '', description: '' }
    ])
  }

  const RemoveEducation = () => {
    setEducationalList(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const onSave = async () => {
    try {
      setLoading(true)

      const resumeId = params?.resumeId
      if (!resumeId) {
        toast('Resume ID missing')
        setLoading(false)
        return
      }

      const data = {
        data: {
          education: educationalList
        }
      }

      await GlobalApi.UpdateResumeDetail(resumeId, data)

      // ✅ UPDATE CONTEXT ONLY ON SAVE (THIS STOPS DANCING)
      setResumeInfo(prev => ({ ...(prev || {}), education: educationalList }))

      setLoading(false)
      toast('Details updated!')
    } catch (err) {
      console.error('Education save error:', err)
      setLoading(false)
      toast('Server Error, Please try again!')
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>

      {(educationalList || []).map((item, index) => (
        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-3 my-5 rounded-lg">
          <div className="col-span-1 sm:col-span-2">
            <label>University Name</label>
            <Input
              name="universityName"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.universityName}
            />
          </div>

          <div>
            <label>Degree</label>
            <Input
              name="degree"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.degree}
            />
          </div>

          <div>
            <label>Major</label>
            <Input
              name="major"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.major}
            />
          </div>

          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.startDate}
            />
          </div>

          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.endDate}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label>Description</label>
            <Textarea
              name="description"
              className="w-full"
              onChange={(e) => handleChange(e, index)}
              value={item.description}
            />
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={AddNewEducation} className="theme-button">
            + Add More
          </Button>
          <Button variant="outline" onClick={RemoveEducation} className="theme-button">
            - Remove
          </Button>
        </div>

        <Button className="theme-button" disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education
