import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummaryPreview from './preview/SummaryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import ProjectPreview from './preview/ProjectPreview';
import AchievementsPreview from './preview/AchievementsPreview';

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="
        shadow-lg
        p-8
        border-t-[15px]
        sm:p-6 md:p-8 lg:p-10
        w-full max-w-[900px] mx-auto
        bg-white text-[10.5pt]
        rounded-lg
      "
      style={{
        borderColor: resumeInfo?.themeColor || '#000000',
        height: 'auto',
        overflow: 'visible',      // ✅ VERY IMPORTANT for PDF
        position: 'static'        // ✅ VERY IMPORTANT for PDF
      }}
    >
      {/* ✅ DO NOT USE @media print for html2pdf */}
      
      <div>
        <div className="mb-2">
          <PersonalDetailPreview resumeInfo={resumeInfo} />
        </div>

        {resumeInfo?.summary && (
          <div className="mb-2">
            <SummaryPreview resumeInfo={resumeInfo} />
          </div>
        )}

        {resumeInfo?.education?.length > 0 && (
          <div className="mb-2">
            <EducationalPreview resumeInfo={resumeInfo} />
          </div>
        )}

        {resumeInfo?.experience?.length > 0 && (
          <div className="mb-2">
            <ExperiencePreview resumeInfo={resumeInfo} />
          </div>
        )}

        {resumeInfo?.projects?.length > 0 && (
          <div className="mb-2">
            <ProjectPreview resumeInfo={resumeInfo} />
          </div>
        )}

        {resumeInfo?.achievements?.length > 0 && (
          <div className="mb-2">
            <AchievementsPreview resumeInfo={resumeInfo} />
          </div>
        )}

        {resumeInfo?.skills?.length > 0 && (
          <div className="mb-2">
            <SkillsPreview resumeInfo={resumeInfo} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumePreview;
