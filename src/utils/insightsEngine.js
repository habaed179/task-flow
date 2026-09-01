export function generateSmartInsights(tasks = [], projects = [], members = []) {
  const insights = [];

  // 1. Overdue tasks insight
  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.completed || t.status === 'Done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  if (overdueCount > 0) {
    insights.push({
      id: 'ins-overdue',
      type: 'warning',
      title: `${overdueCount} Task${overdueCount > 1 ? 's' : ''} Overdue`,
      description: `Your workspace currently has ${overdueCount} task(s) past deadline. Consider reassigning or updating due dates.`,
    });
  }

  // 2. High Workload Member Insight
  if (members.length > 0) {
    const memberCounts = members.map((m) => {
      const activeCount = tasks.filter((t) => (t.assigneeId === m.id || t.assigneeName === m.name) && !t.completed && t.status !== 'Done').length;
      return { member: m, activeCount };
    });

    memberCounts.sort((a, b) => b.activeCount - a.activeCount);
    const busiest = memberCounts[0];

    if (busiest && busiest.activeCount >= 3) {
      insights.push({
        id: 'ins-workload',
        type: 'info',
        title: `Peak Workload: ${busiest.member.name}`,
        description: `${busiest.member.name} has ${busiest.activeCount} active tasks assigned. Balance workload across the team to prevent bottlenecks.`,
      });
    }
  }

  // 3. Project Health Insight
  const criticalProjects = projects.filter((p) => {
    const projTasks = tasks.filter((t) => t.projectId === p.id);
    const total = projTasks.length;
    if (total === 0) return false;
    const done = projTasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
    const rate = Math.round((done / total) * 100);
    return rate < 40 && total > 2;
  });

  if (criticalProjects.length > 0) {
    insights.push({
      id: 'ins-project',
      type: 'danger',
      title: `Project At Risk: ${criticalProjects[0].name}`,
      description: `Project "${criticalProjects[0].name}" has a low completion rate (<40%). Review deliverables with project leads.`,
    });
  }

  // 4. Productivity Positive Trend Insight
  const completedTotal = tasks.filter((t) => (t.status || t.completed) === 'Done' || t.completed).length;
  if (completedTotal > 0) {
    insights.push({
      id: 'ins-velocity',
      type: 'success',
      title: 'Strong Team Completion Rate',
      description: `Your team has completed ${completedTotal} task(s) in this workspace. Keep up the momentum!`,
    });
  }

  return insights;
}
