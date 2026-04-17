import { createAdminClient } from '@/lib/supabase-server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { CourseCard } from '@/components/dashboard/course-card';
import { TrendingUp, Award, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Engineering Career OS',
  description: 'Manage your engineering learning journey, track your progress, and explore recommended courses.',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const supabase = await createAdminClient();

  // 1. Fetch Enrolled Courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, courses(*)')
    .eq('user_id', userId);

  const enrolledCourses = enrollments?.map((e: any) => e.courses).filter(Boolean) || [];

  // 2. Fetch Progress for enrolled courses
  const { data: progressData } = await supabase
    .from('progress')
    .select('course_id, completed')
    .eq('user_id', userId);

  const userProgress: Record<string, number> = {};
  progressData?.forEach((p: any) => {
    userProgress[p.course_id] = p.completed ? 100 : 0;
  });

  // 3. Fetch Recommended Courses (excluding enrolled)
  const enrolledIds = enrolledCourses.map((c: any) => c.id);
  let { data: recommendedCourses } = await supabase
    .from('courses')
    .select('*')
    .limit(6);

  if (enrolledIds.length > 0) {
    recommendedCourses = recommendedCourses?.filter((c: any) => !enrolledIds.includes(c.id)) || [];
  }

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-8 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Welcome section */}
        <WelcomeCard
          name={user?.firstName || 'Developer'}
          completedCourses={progressData?.filter((p: any) => p.completed).length || 0}
          totalCourses={enrolledCourses.length || 0}
          inProgressCourses={enrolledCourses.length - (progressData?.filter((p: any) => p.completed).length || 0)}
        />

        {/* Quick Stats — real data */}
        {(() => {
          const completedCount = progressData?.filter((p: any) => p.completed).length || 0;
          const totalEnrolled = enrolledCourses.length;
          const completionRate = totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center gap-4 md:gap-6 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Completion Rate</p>
                  <h4 className="text-xl md:text-2xl font-black text-white">{completionRate}%</h4>
                </div>
              </div>
              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center gap-4 md:gap-6 hover:border-emerald-500/30 transition-all group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Completed</p>
                  <h4 className="text-xl md:text-2xl font-black text-white">{completedCount} Course{completedCount !== 1 ? 's' : ''}</h4>
                </div>
              </div>
              <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center gap-4 md:gap-6 hover:border-violet-500/30 transition-all group sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Enrolled</p>
                  <h4 className="text-xl md:text-2xl font-black text-white">{totalEnrolled} Course{totalEnrolled !== 1 ? 's' : ''}</h4>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Continue Learning */}
        {enrolledCourses.length > 0 && (
          <section className="space-y-6 md:space-y-8">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg md:text-2xl font-black text-white tracking-tight">Continue Learning</h3>
              <Link href="/my-courses" className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {enrolledCourses.map((course: any) => (
                <CourseCard
                  key={`enroll-${course.id}`}
                  id={course.id}
                  title={course.title}
                  instructor={course.instructor}
                  thumbnail_url={course.thumbnail_url}
                  category={course.category}
                  level={course.level}
                  enrolled={true}
                  progress={userProgress[course.id] || 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Courses Grid */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg md:text-2xl font-black text-white tracking-tight">Recommended for You</h3>
            <Link href="/courses" className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Discover All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recommendedCourses?.map((course: any) => (
              <CourseCard
                key={`rec-${course.id}`}
                id={course.id}
                title={course.title}
                instructor={course.instructor}
                thumbnail_url={course.thumbnail_url}
                category={course.category}
                level={course.level}
                enrolled={enrolledIds.includes(course.id)}
                progress={userProgress[course.id] || 0}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
