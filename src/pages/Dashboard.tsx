import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CoupleAvatars } from "@/components/CoupleAvatars";
import { SyncScoreCircle } from "@/components/SyncScoreCircle";
import { DashboardCard } from "@/components/DashboardCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Calendar, Heart, MessageCircle, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [syncScore, setSyncScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading and score animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setSyncScore(82); // Demo score - this would come from your Supabase query
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckinClick = () => {
    navigate('/ai-coach');
    toast({
      title: "Starting Daily Check-in! 💕",
      description: "Let's see how you're both feeling today",
    });
  };

  const handlePlanDateClick = () => {
    navigate('/date-planner');
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

        {/* Dashboard Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
          {/* Upcoming Date Card */}
          <DashboardCard
            title="Upcoming Date"
            icon={<Calendar size={20} />}
            expandedContent={
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-sm font-inter">Tomorrow at 7:00 PM</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cozy dinner at that Italian place you both love. Don't forget to bring flowers! 🌹
                </p>
              </div>
            }
          >
            <p className="text-sm font-inter text-muted-foreground font-bold">
              Romantic dinner tomorrow
            </p>
            <p className="text-lg font-poppins font-bold text-foreground">
              Bella Vista Restaurant
            </p>
          </DashboardCard>

          {/* Last Check-in Card */}
          <DashboardCard
            title="Last Check-in"
            icon={<Heart size={20} />}
            expandedContent={
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">You</p>
                    <p className="text-sm font-medium">Feeling grateful 😊</p>
                    <p className="text-xs text-muted-foreground mt-1">Energy: 8/10</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Partner</p>
                    <p className="text-sm font-medium">Excited about tonight! 🎉</p>
                    <p className="text-xs text-muted-foreground mt-1">Energy: 9/10</p>
                  </div>
                </div>
              </div>
            }
          >
            <p className="text-sm font-inter text-muted-foreground font-bold">
              Yesterday evening
            </p>
            <p className="text-lg font-poppins font-bold text-foreground">
              Both feeling great! ✨
            </p>
          </DashboardCard>

          {/* Recent Memory Card */}
          <DashboardCard
            title="Recent Memory"
            icon={<Sparkles size={20} />}
            className="md:col-span-2"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gradient-romance rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-lg font-poppins font-bold text-foreground mb-1">
                  Beach Sunset Walk
                </p>
                <p className="text-sm font-inter text-muted-foreground font-semibold">
                  "The most beautiful sunset we've ever seen together. Your hand in mine felt like home." 🌅
                </p>
                <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
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