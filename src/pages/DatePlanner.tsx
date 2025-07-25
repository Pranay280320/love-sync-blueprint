import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Calendar, MapPin, Clock, DollarSign, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dateActivitiesImage from "@/assets/date-activities.jpg";

interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  cost: string;
  location: string;
  rating: number;
}

const mockDateIdeas: DateIdea[] = [
  {
    id: '1',
    title: 'Sunset Picnic in the Park',
    description: 'Pack your favorite snacks and watch the sunset together in a beautiful park setting.',
    category: 'Outdoor',
    duration: '2-3 hours',
    cost: '$',
    location: 'Local Park',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Cooking Class for Two',
    description: 'Learn to make pasta from scratch while enjoying wine and each other\'s company.',
    category: 'Indoor',
    duration: '3-4 hours',
    cost: '$$$',
    location: 'Culinary Studio',
    rating: 4.9
  },
  {
    id: '3',
    title: 'Stargazing Adventure',
    description: 'Drive to a dark sky location with blankets and hot cocoa for a romantic night under the stars.',
    category: 'Outdoor',
    duration: '4-5 hours',
    cost: '$',
    location: 'Dark Sky Area',
    rating: 4.7
  }
];

const categories = ['All', 'Outdoor', 'Indoor', 'Adventure', 'Relaxing', 'Creative'];

export const DatePlanner = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(null);
  const { toast } = useToast();

  const filteredIdeas = activeCategory === 'All' 
    ? mockDateIdeas 
    : mockDateIdeas.filter(idea => idea.category === activeCategory);

  const handleSchedule = (idea: DateIdea) => {
    setSelectedIdea(idea);
    toast({
      title: "Great choice! 💕",
      description: `Let's schedule "${idea.title}" for you two!`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-romance text-white p-6 shadow-romantic">
        <h1 className="text-2xl font-bold font-poppins mb-2">Date Planner</h1>
        <p className="text-white/80 font-inter">Find the perfect date idea for you two</p>
      </div>

      {/* Category Filters */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-secondary text-secondary-foreground shadow-romantic transform scale-105' 
                  : 'hover:bg-muted hover:scale-105'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Date Ideas Grid */}
      <div className="px-4 space-y-4">
        {filteredIdeas.map((idea, index) => (
          <div
            key={idea.id}
            className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-romantic transition-all duration-300 transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
              <img 
                src={dateActivitiesImage} 
                alt={idea.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-gold-accent text-accent-foreground">
                  <Star size={12} className="mr-1" />
                  {idea.rating}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold font-poppins text-foreground">{idea.title}</h3>
                <Badge variant="outline" className="ml-2">
                  {idea.category}
                </Badge>
              </div>

              <p className="text-muted-foreground font-inter mb-4 leading-relaxed">
                {idea.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span>{idea.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign size={16} />
                  <span>{idea.cost}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <MapPin size={16} />
                  <span>{idea.location}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleSchedule(idea)}
                variant="romantic"
                className="w-full"
              >
                <Calendar className="mr-2" size={18} />
                Schedule This Date
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal (Simple version) */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-romantic animate-slide-up">
            <div className="text-center mb-6">
              <Heart className="mx-auto text-secondary mb-2" size={32} />
              <h3 className="text-xl font-bold font-poppins mb-2">Schedule Your Date</h3>
              <p className="text-muted-foreground font-inter">
                {selectedIdea.title}
              </p>
            </div>

            <div className="space-y-4">
              <Button variant="romantic" className="w-full">
                <Calendar className="mr-2" />
                Choose Date & Time
              </Button>
              <Button variant="outline" className="w-full">
                Add to Calendar
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setSelectedIdea(null)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};