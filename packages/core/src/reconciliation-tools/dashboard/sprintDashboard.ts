import { Sprint, TeamMember, TaskStatusType } from '../types';
import { fileManager } from '../utils/fileManager';
import { matrixTracker } from '../matrix/matrixTracker';
import chalk from 'chalk';

/**
 * Sprint Dashboard for visualizing reconciliation sprint progress
 */
export class SprintDashboard {
  private sprint: Sprint | null = null;
  
  /**
   * Create a new sprint dashboard
   */
  constructor() {
    this.loadSprint();
  }
  
  /**
   * Load sprint data
   */
  private loadSprint(): void {
    this.sprint = fileManager.readSprint();
    
    if (!this.sprint) {
      console.warn(chalk.yellow('No sprint data found. Use initializeSprint() to create a new sprint.'));
    }
  }
  
  /**
   * Initialize a new sprint
   * @param id Sprint ID
   * @param name Sprint name
   * @param startDate Start date
   * @param endDate End date
   * @param team Team members
   * @returns The newly created sprint
   */
  public initializeSprint(
    id: string,
    name: string,
    startDate: string,
    endDate: string,
    team: TeamMember[] = []
  ): Sprint {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    this.sprint = {
      id,
      name,
      startDate,
      endDate,
      currentDay: 1,
      totalDays,
      team,
      milestones: [],
      blockers: []
    };
    
    fileManager.writeSprint(this.sprint);
    return this.sprint;
  }
  
  /**
   * Update sprint current day
   * @param day Day number (1-based)
   * @returns true if successful, false otherwise
   */
  public updateCurrentDay(day: number): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    if (day < 1 || day > this.sprint.totalDays) {
      console.error(chalk.red(`Day must be between 1 and ${this.sprint.totalDays}`));
      return false;
    }
    
    this.sprint.currentDay = day;
    return fileManager.writeSprint(this.sprint);
  }

  /**
   * Add a team member to the sprint
   * @param member Team member to add
   * @returns true if successful, false otherwise
   */
  public addTeamMember(member: TeamMember): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    // Check if team member already exists
    if (this.sprint.team.some(m => m.name === member.name)) {
      console.error(chalk.red(`Team member ${member.name} already exists`));
      return false;
    }
    
    this.sprint.team.push(member);
    return fileManager.writeSprint(this.sprint);
  }
  
  /**
   * Add a milestone to the sprint
   * @param name Milestone name
   * @param day Target day
   * @param description Milestone description
   * @returns true if successful, false otherwise
   */
  public addMilestone(
    name: string,
    day: number,
    description: string
  ): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    if (day < 1 || day > this.sprint.totalDays) {
      console.error(chalk.red(`Day must be between 1 and ${this.sprint.totalDays}`));
      return false;
    }
    
    this.sprint.milestones.push({
      name,
      day,
      status: 'NOT_STARTED',
      description
    });
    
    return fileManager.writeSprint(this.sprint);
  }
  
  /**
   * Update milestone status
   * @param name Milestone name
   * @param status New status
   * @returns true if successful, false otherwise
   */
  public updateMilestoneStatus(name: string, status: TaskStatusType): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    const milestoneIndex = this.sprint.milestones.findIndex(m => m.name === name);
    if (milestoneIndex === -1) {
      console.error(chalk.red(`Milestone ${name} not found`));
      return false;
    }
    
    this.sprint.milestones[milestoneIndex].status = status;
    return fileManager.writeSprint(this.sprint);
  }
  
  /**
   * Add a blocker to the sprint
   * @param description Blocker description
   * @param impact Blocker impact
   * @param owner Owner responsible for resolution
   * @param resolution Resolution plan (optional)
   * @returns true if successful, false otherwise
   */
  public addBlocker(
    description: string,
    impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    owner: string,
    resolution?: string
  ): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    this.sprint.blockers.push({
      description,
      impact,
      owner,
      resolution,
      status: 'ACTIVE'
    });
    
    return fileManager.writeSprint(this.sprint);
  }
  
  /**
   * Resolve a blocker
   * @param index Blocker index
   * @param resolution Resolution description
   * @returns true if successful, false otherwise
   */
  public resolveBlocker(index: number, resolution: string): boolean {
    if (!this.sprint) {
      console.error(chalk.red('No sprint loaded'));
      return false;
    }
    
    if (index < 0 || index >= this.sprint.blockers.length) {
      console.error(chalk.red(`Blocker index ${index} out of range`));
      return false;
    }
    
    this.sprint.blockers[index].status = 'RESOLVED';
    this.sprint.blockers[index].resolution = resolution;
    return fileManager.writeSprint(this.sprint);
  }
  
  /**
   * Get the current sprint
   * @returns The current sprint or null if not loaded
   */
  public getSprint(): Sprint | null {
    return this.sprint;
  }
  
  /**
   * Generate a progress bar
   * @param current Current value
   * @param total Total value
   * @param width Width of the progress bar
   * @returns Progress bar string
   */
  private generateProgressBar(current: number, total: number, width: number = 20): string {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const filledWidth = Math.round((current / total) * width);
    const emptyWidth = width - filledWidth;
    
    const filled = chalk.green('█'.repeat(filledWidth));
    const empty = chalk.gray('░'.repeat(emptyWidth));
    
    return `${filled}${empty} ${percentage}%`;
  }
  
  /**
   * Generate a status indicator
   * @param status Status
   * @returns Colored status indicator
   */
  private generateStatusIndicator(status: TaskStatusType): string {
    switch (status) {
      case 'COMPLETED':
        return chalk.green('✓');
      case 'IN_PROGRESS':
        return chalk.yellow('◐');
      case 'NOT_STARTED':
        return chalk.red('✗');
      default:
        return chalk.gray('?');
    }
  }
  
  /**
   * Render the dashboard as a string
   * @returns Dashboard string
   */
  public renderDashboard(): string {
    if (!this.sprint) {
      return chalk.yellow('No sprint loaded. Use initializeSprint() to create a new sprint.');
    }
    
    const { id, name, currentDay, totalDays, team, milestones, blockers } = this.sprint;
    
    // Calculate sprint progress
    const sprintProgress = this.generateProgressBar(currentDay, totalDays);
    
    // Calculate matrix progress
    const matrix = matrixTracker.getMatrix();
    const { total, verified, reconciled } = matrix.progress;
    const verificationProgress = this.generateProgressBar(verified, total);
    const reconciliationProgress = this.generateProgressBar(reconciled, total);
    
    // Format milestones
    const milestonesSection = milestones.length > 0
      ? milestones
        .map(m => {
          const status = this.generateStatusIndicator(m.status);
          return `  ${status} Day ${m.day}: ${chalk.bold(m.name)} - ${m.description}`;
        })
        .join('\n')
      : '  No milestones defined';
    
    // Format active blockers
    const activeBlockers = blockers.filter(b => b.status === 'ACTIVE');
    const blockersSection = activeBlockers.length > 0
      ? activeBlockers
        .map((b, i) => {
          const impactColor = b.impact === 'CRITICAL' ? chalk.red
            : b.impact === 'HIGH' ? chalk.yellow
            : b.impact === 'MEDIUM' ? chalk.blue
            : chalk.gray;
          
          return `  ${i + 1}. ${impactColor(b.impact)}: ${b.description} (Owner: ${chalk.cyan(b.owner)})`;
        })
        .join('\n')
      : '  No active blockers';
    
    // Format team status
    const teamSection = team.length > 0
      ? team
        .map(member => {
          const completedTasks = member.tasks.filter(t => t.status === 'COMPLETED').length;
          const inProgressTasks = member.tasks.filter(t => t.status === 'IN_PROGRESS').length;
          const notStartedTasks = member.tasks.filter(t => t.status === 'NOT_STARTED').length;
          
          const taskProgress = this.generateProgressBar(
            completedTasks,
            member.tasks.length || 1
          );
          
          return [
            `  ${chalk.cyan(member.name)} (${chalk.gray(member.role)})`,
            `    Components: ${member.ownedComponents.length > 0 ? member.ownedComponents.join(', ') : 'None'}`,
            `    Tasks: ${chalk.green(completedTasks.toString())} completed, ${chalk.yellow(inProgressTasks.toString())} in progress, ${chalk.red(notStartedTasks.toString())} not started`,
            `    Progress: ${taskProgress}`
          ].join('\n');
        })
        .join('\n\n')
      : '  No team members defined';
    
    // Format critical components with discrepancies
    const criticalDiscrepancies = matrixTracker.getComponentsByPriority('CRITICAL')
      .filter(c => c.documentedStatus !== c.actualStatus);
    
    const discrepanciesSection = criticalDiscrepancies.length > 0
      ? criticalDiscrepancies
        .map(c => {
          return `  - ${chalk.bold(c.name)}: Documented as ${chalk.blue(c.documentedStatus)}, actually ${chalk.yellow(c.actualStatus)} (Owner: ${chalk.cyan(c.owner)})`;
        })
        .join('\n')
      : '  No critical discrepancies';
    
    // Build the dashboard
    const dashboard = [
      chalk.bold.green(`# Reconciliation Sprint Dashboard: ${name} (${id})`),
      chalk.white(`Date: ${new Date().toISOString().split('T')[0]} - Day ${currentDay} of ${totalDays}`),
      '',
      chalk.bold.white('## Overall Progress'),
      `Sprint Progress:    ${sprintProgress}`,
      `Verification:       ${verificationProgress}`,
      `Reconciliation:     ${reconciliationProgress}`,
      '',
      chalk.bold.white('## Milestones'),
      milestonesSection,
      '',
      chalk.bold.white('## Active Blockers'),
      blockersSection,
      '',
      chalk.bold.white('## Critical Discrepancies'),
      discrepanciesSection,
      '',
      chalk.bold.white('## Team Status'),
      teamSection
    ].join('\n');
    
    return dashboard;
  }
  
  /**
   * Print the dashboard to the console
   */
  public printDashboard(): void {
    console.log(this.renderDashboard());
  }
  
  /**
   * Generate daily status report
   * @returns Status report string
   */
  public generateDailyReport(): string {
    if (!this.sprint) {
      return chalk.yellow('No sprint loaded.');
    }
    
    const { id, name, currentDay, totalDays, team, milestones, blockers } = this.sprint;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate sprint progress
    const sprintPercentage = Math.round((currentDay / totalDays) * 100);
    
    // Calculate matrix progress
    const matrix = matrixTracker.getMatrix();
    const { total, verified, reconciled } = matrix.progress;
    const verificationPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    const reconciliationPercentage = total > 0 ? Math.round((reconciled / total) * 100) : 0;
    
    // Today's milestones
    const todayMilestones = milestones.filter(m => m.day === currentDay);
    const milestonesSection = todayMilestones.length > 0
      ? todayMilestones
        .map(m => {
          const statusIndicator = this.generateStatusIndicator(m.status);
          return `  - ${statusIndicator} ${chalk.bold(m.name)}: ${m.description} (${m.status})`;
        })
        .join('\n')
      : '  No milestones scheduled for today';
    
    // Active blockers
    const activeBlockers = blockers.filter(b => b.status === 'ACTIVE');
    const blockersSection = activeBlockers.length > 0
      ? activeBlockers
        .map(b => {
          const impactColor = b.impact === 'CRITICAL' ? chalk.red
            : b.impact === 'HIGH' ? chalk.yellow
            : b.impact === 'MEDIUM' ? chalk.blue
            : chalk.gray;
          
          return `  - ${impactColor(b.impact)}: ${b.description} (Owner: ${chalk.cyan(b.owner)})`;
        })
        .join('\n')
      : '  No active blockers';
    
    // Team updates
    const teamSection = team.length > 0
      ? team
        .map(member => {
          const completedTasks = member.tasks.filter(t => t.status === 'COMPLETED').length;
          const totalTasks = member.tasks.length;
          const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          return `  - ${chalk.cyan(member.name)}: ${chalk.green(completedTasks.toString())}/${totalTasks} tasks (${taskPercentage}%)`;
        })
        .join('\n')
      : '  No team members defined';
    
    // Critical components to focus on tomorrow
    const criticalComponents = matrixTracker.getComponentsByPriority('CRITICAL')
      .filter(c => c.status !== 'COMPLETED')
      .slice(0, 5); // Top 5
    
    const criticalSection = criticalComponents.length > 0
      ? criticalComponents
        .map(c => {
          const statusIndicator = this.generateStatusIndicator(c.status);
          return `  - ${statusIndicator} ${chalk.bold(c.name)}: ${c.status} (Owner: ${chalk.cyan(c.owner)})`;
        })
        .join('\n')
      : '  No critical components remaining';
    
    // Build the report
    const report = [
      chalk.bold.green(`# Daily Status Report - ${today}`),
      chalk.white(`Sprint: ${name} (${id}) - Day ${currentDay} of ${totalDays}`),
      '',
      chalk.bold.white('## Progress Summary'),
      `- Sprint: ${sprintPercentage}% complete`,
      `- Verification: ${verificationPercentage}% complete (${verified}/${total} components)`,
      `- Reconciliation: ${reconciliationPercentage}% complete (${reconciled}/${total} components)`,
      '',
      chalk.bold.white('## Today\'s Milestones'),
      milestonesSection,
      '',
      chalk.bold.white('## Active Blockers'),
      blockersSection,
      '',
      chalk.bold.white('## Team Status'),
      teamSection,
      '',
      chalk.bold.white('## Focus for Tomorrow'),
      criticalSection
    ].join('\n');
    
    return report;
  }
}

// Export default instance
export const sprintDashboard = new SprintDashboard();