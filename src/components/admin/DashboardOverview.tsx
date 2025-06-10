
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { EQUIPMENT_CATEGORIES, BRANCHES } from "@/config/equipmentCategories";
import { useDashboardData } from "@/hooks/useDashboardData";
import MetricsCards from "@/components/admin/dashboard/MetricsCards";
import CategoryStatsCard from "@/components/admin/dashboard/CategoryStatsCard";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import QuickActions from "@/components/admin/dashboard/QuickActions";

interface DashboardOverviewProps {
  branch: string;
}

const DashboardOverview = ({ branch }: DashboardOverviewProps) => {
  const [viewMode, setViewMode] = useState<'total' | 'available'>('available');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { refreshKey, categoryStats, stats } = useDashboardData(branch);

  const filteredStats = selectedCategory === 'all' 
    ? categoryStats 
    : categoryStats.filter(cat => cat.id === selectedCategory);

  const currentBranch = BRANCHES.find(b => b.id === branch);

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Branch Info & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold">
            {currentBranch?.name} Overview
          </h2>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EQUIPMENT_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant={viewMode === 'total' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('total')}
          >
            Total Stock
          </Button>
          <Button 
            variant={viewMode === 'available' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('available')}
          >
            Available Stock
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <MetricsCards stats={stats} />

      {/* Equipment Categories Breakdown */}
      <CategoryStatsCard 
        filteredStats={filteredStats}
        selectedCategory={selectedCategory}
        branch={branch}
      />

      {/* Recent Activity */}
      <ActivityFeed />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default DashboardOverview;
