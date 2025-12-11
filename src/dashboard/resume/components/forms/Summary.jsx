import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { Brain, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState(null)

  // ✅ Load existing summary once
  useEffect(() => {
    if (resumeInfo?.summary) {
      setSummary(resumeInfo.summary)
    }
  }, [resumeInfo])

  // ✅ ONLY update context when summary changes (no infinite loop)
  useEffect(() => {
    if (!summary) return
    setResumeInfo((prev) => ({
      ...prev,
      summary: summary,
    }))
  }, [summary])

  // ✅ SMART MOCK AI (SUMMARY + EXPERIENCE)
  const GenerateSummaryFromAI = async () => {
    try {
      setLoading(true)

      const body = {
        name: resumeInfo?.name || 'User',
        role: resumeInfo?.jobTitle || 'Software Engineer',
        skills: resumeInfo?.skills || 'JavaScript, React',
        experience: resumeInfo?.experience || 0,
      }

      const response = await fetch('http://localhost:5000/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      // ✅ Show summary suggestion
      setAiGenerateSummaryList([
        {
          experience_level: 'Professional',
          summary: data.summary,
        },
      ])

      // ✅ AUTO-FILL EXPERIENCE SECTION FROM AI
      if (data.experience) {
        setResumeInfo((prev) => ({
          ...prev,
          experience: data.experience,
        }))
      }

    } catch (error) {
      console.error('AI Error:', error)
      alert('AI Generation Failed')
    } finally {
      setLoading(false)
    }
  }

  const onSave = (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      data: {
        summary: summary,
      },
    }

    GlobalApi.UpdateResumeDetail(params?.resumeId, data)
      .then(() => {
        enabledNext(true)
        setLoading(false)
        toast('Details updated')
      })
      .catch(() => {
        setLoading(false)
        toast('Save failed')
      })
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Summary</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Add a summary for your job title
      </p>

      <form className="mt-6" onSubmit={onSave}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <label className="font-medium">Add Summary</label>
          <Button
            type="button"
            size="sm"
            onClick={GenerateSummaryFromAI}
            className="theme-button flex items-center gap-2"
            disabled={loading}
          >
            <Brain className="h-4 w-4" />
            {loading ? 'Generating...' : 'Generate from AI'}
          </Button>
        </div>

        <Textarea
          className="mt-4 w-full"
          required
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <Button type="submit" className="theme-button" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>

      {aiGeneratedSummaryList && (
        <div className="my-6">
          <h2 className="font-bold text-lg mb-2">AI Suggestions</h2>
          {aiGeneratedSummaryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummary(item?.summary)}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 shadow cursor-pointer transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <h3 className="text-primary font-semibold mb-1">
                Level: {item?.experience_level}
              </h3>
              <p className="text-sm">{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Summary
