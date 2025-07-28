import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CoupleAvatars } from "@/components/CoupleAvatars";
import { SyncScoreCircle } from "@/components/SyncScoreCircle";
import { DashboardCard } from "@/components/DashboardCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { StreakDisplay } from "@/components/StreakDisplay";
import { CoupleMoodDisplay } from "@/components/CoupleMoodDisplay";
import { Calendar, Heart, MessageCircle, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const [syncScore, setSyncScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [upcomingDate, setUpcomingDate] = useState<any>(null);
  const [lastCheckin, setLastCheckin] = useState<any>(null);
  const [recentMemory, setRecentMemory] = useState<any>(null);
  const [checkinStreak, setCheckinStreak] = useState(0);
  const [loveStreak, setLoveStreak] = useState(0);
  const [userMood, setUserMood] = useState<string>();
  const [partnerMood, setPartnerMood] = useState<string>();
  const [coupleId, setCoupleId] = useState<string>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // First, get user's couple relationship
      const { data: coupleData } = await supabase
        .from('couples')
        .select('id, user1_id, user2_id')
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .maybeSingle();

      const currentCoupleId = coupleData?.id;
      setCoupleId(currentCoupleId);
      
      const partnerId = coupleData?.user1_id === user?.id ? coupleData?.user2_id : coupleData?.user1_id;

      // Fetch sync score
      const { data: syncData } = await supabase
        .from('sync_scores')
        .select('score')
        .eq('couple_id', currentCoupleId)
        .order('calculated_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch upcoming planned date
      const { data: dateData } = await supabase
        .from('planned_dates')
        .select('*')
        .eq('couple_id', currentCoupleId)
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      // Fetch recent memory
      const { data: memoryData } = await supabase
        .from('memories')
        .select('*')
        .eq('couple_id', currentCoupleId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch last checkin for current user
      const { data: checkinData } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .eq('couple_id', currentCoupleId)
        .order('checkin_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Calculate checkin streak
      const { data: allCheckins } = await supabase
        .from('daily_checkins')
        .select('checkin_date, user_id')
        .eq('couple_id', currentCoupleId)
        .order('checkin_date', { ascending: false });

      let streak = 0;
      if (allCheckins && allCheckins.length > 0) {
        const today = new Date().toDateString();
        let currentDate = new Date();
        
        // Group checkins by date
        const checkinsByDate = allCheckins.reduce((acc, checkin) => {
          const date = new Date(checkin.checkin_date).toDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(checkin.user_id);
          return acc;
        }, {} as Record<string, string[]>);

        // Calculate consecutive days where both partners checked in
        while (true) {
          const dateStr = currentDate.toDateString();
          const dayCheckins = checkinsByDate[dateStr];
          
          if (dayCheckins && dayCheckins.length === 2) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Get today's moods
      const today = new Date().toISOString().split('T')[0];
      
      const { data: userMoodData } = await supabase
        .from('daily_checkins')
        .select('mood')
        .eq('user_id', user?.id)
        .eq('couple_id', currentCoupleId)
        .eq('checkin_date', today)
        .maybeSingle();

      const { data: partnerMoodData } = await supabase
        .from('daily_checkins')
        .select('mood')
        .eq('user_id', partnerId)
        .eq('couple_id', currentCoupleId)
        .eq('checkin_date', today)
        .maybeSingle();

      setSyncScore(syncData?.score || 75);
      setUpcomingDate(dateData);
      setRecentMemory(memoryData);
      setLastCheckin(checkinData);
      setCheckinStreak(streak);
      setLoveStreak(streak); // For now, love streak = checkin streak
      setUserMood(userMoodData?.mood);
      setPartnerMood(partnerMoodData?.mood);
      setIsLoaded(true);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoaded(true);
    }
  };

  const handleCheckinClick = () => {
    navigate('/coach');
    toast({
      title: "Starting Daily Check-in! 💕",
      description: "Let's see how you're both feeling today",
    });
  };

  const handlePlanDateClick = () => {
    navigate('/planner');
    toast({
      title: "Time to plan something special! ✨",
      description: "Let's find the perfect date idea for you two",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-soft-cloud via-background to-muted/30 -z-10"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-sunrise-coral/30 rounded-full animate-float-love"></div>
      <div className="absolute top-40 right-16 w-2 h-2 bg-gold-accent/40 rounded-full animate-float-love" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-sunrise-coral/20 rounded-full animate-float-love" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className={`text-center space-y-2 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="text-3xl font-extrabold font-poppins text-foreground">
            Good morning, lovebirds! 💕
          </h1>
          <p className="text-muted-foreground font-inter font-semibold">
            Here's how your relationship is syncing today
          </p>
        </div>

        {/* Sync Score Section */}
        <div className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <SyncScoreCircle score={syncScore} animated={isLoaded} />
        </div>

        {/* Couple Avatars */}
        <div className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <CoupleAvatars syncScore={syncScore} animated={isLoaded} />
        </div>

        {/* Love Streaks */}
        <div className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
          <StreakDisplay checkinStreak={checkinStreak} loveStreak={loveStreak} />
        </div>

        {/* Couple Mood Display */}
        <div className={`${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '550ms' }}>
          <CoupleMoodDisplay userMood={userMood} partnerMood={partnerMood} />
        </div>

        {/* Dashboard Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '700ms' }}>
          {/* Upcoming Date Card */}
          <DashboardCard
            title="Upcoming Date"
            icon={<Calendar size={20} />}
            expandedContent={
              upcomingDate ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm font-inter font-bold">
                      {new Date(upcomingDate.scheduled_date).toLocaleDateString()} at{' '}
                      {new Date(upcomingDate.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {upcomingDate.description || "Get ready for an amazing time together! 🌹"}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground font-medium">No upcoming dates planned</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/planner')}
                  >
                    Plan a Date
                  </Button>
                </div>
              )
            }
          >
            {upcomingDate ? (
              <>
                <p className="text-sm font-inter text-muted-foreground font-bold">
                  {new Date(upcomingDate.scheduled_date).toLocaleDateString()}
                </p>
                <p className="text-lg font-poppins font-bold text-foreground">
                  {upcomingDate.title}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-inter text-muted-foreground font-bold">
                  No dates planned
                </p>
                <p className="text-lg font-poppins font-bold text-foreground">
                  Plan something special!
                </p>
              </>
            )}
          </DashboardCard>

          {/* Last Check-in Card */}
          <DashboardCard
            title="Last Check-in"
            icon={<Heart size={20} />}
            expandedContent={
              lastCheckin ? (
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Your last check-in</p>
                    <p className="text-sm font-medium">Mood: {lastCheckin.mood}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Energy: {lastCheckin.energy_level}/10
                    </p>
                    {lastCheckin.message && (
                      <p className="text-sm text-muted-foreground mt-2">"{lastCheckin.message}"</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground font-medium">No check-ins yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/coach')}
                  >
                    Start Daily Check-in
                  </Button>
                </div>
              )
            }
          >
            {lastCheckin ? (
              <>
                <p className="text-sm font-inter text-muted-foreground font-bold">
                  {new Date(lastCheckin.checkin_date).toLocaleDateString()}
                </p>
                <p className="text-lg font-poppins font-bold text-foreground">
                  Feeling {lastCheckin.mood}! ✨
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-inter text-muted-foreground font-bold">
                  Start your journey
                </p>
                <p className="text-lg font-poppins font-bold text-foreground">
                  Daily check-in awaits!
                </p>
              </>
            )}
          </DashboardCard>

          {/* Recent Memory Card */}
          <DashboardCard
            title="Recent Memory"
            icon={<Sparkles size={20} />}
            className="md:col-span-2"
          >
            {recentMemory ? (
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-romance rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-poppins font-bold text-foreground mb-1">
                    {recentMemory.title}
                  </p>
                  <p className="text-sm font-inter text-muted-foreground font-semibold">
                    {recentMemory.content?.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(recentMemory.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground font-medium">No memories yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/vault')}
                >
                  Create Your First Memory
                </Button>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '900ms' }}>
          <Button 
            variant="romantic" 
            size="xl" 
            className="w-full"
            onClick={handleCheckinClick}
          >
            <MessageCircle className="mr-2" />
            Daily Check-in
          </Button>
          
          <Button 
            variant="golden" 
            size="lg" 
            className="w-full"
            onClick={handlePlanDateClick}
          >
            <Calendar className="mr-2" />
            Plan a Date
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};