#!/usr/bin/env python3
"""
zkSDK Strategic Orchestration System
Top-tier strategic management for complex privacy SDK development
"""

import subprocess
import time
import datetime
import logging
import json
import os
import threading
from pathlib import Path
import schedule
from typing import Dict, List, Optional
import asyncio

class ZkSDKStrategicOrchestrator:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.recipes_dir = self.base_dir
        self.outputs_dir = self.base_dir / "outputs"
        self.logs_dir = self.outputs_dir / "logs"
        
        # Ensure directories exist
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        (self.outputs_dir / "strategic").mkdir(parents=True, exist_ok=True)
        (self.outputs_dir / "intelligence").mkdir(parents=True, exist_ok=True)
        (self.outputs_dir / "marketing").mkdir(parents=True, exist_ok=True)
        (self.outputs_dir / "releases").mkdir(parents=True, exist_ok=True)
        
        # Set up logging
        self.setup_logging()
        
        # Strategic agent configurations
        self.strategic_agents = {
            "strategy_chief": {
                "recipe": "recipe-strategy-chief.yaml",
                "model": "claude",
                "priority": 1,
                "schedule": "daily at 08:00, 14:00, 20:00",
                "session_duration": 90 * 60,  # 90 minutes
                "role": "Chief Strategy Officer - Master project leader"
            },
            "marketing_growth": {
                "recipe": "recipe-marketing-growth.yaml", 
                "model": "groq",
                "priority": 2,
                "schedule": "every 4 hours",
                "session_duration": 60 * 60,  # 60 minutes
                "role": "Marketing & Growth Engine"
            },
            "research_intelligence": {
                "recipe": "recipe-research-intelligence.yaml",
                "model": "claude",
                "priority": 2,
                "schedule": "daily at 09:00",
                "session_duration": 120 * 60,  # 2 hours
                "role": "Research & Intelligence Mastermind"
            },
            "release_operations": {
                "recipe": "recipe-release-operations.yaml",
                "model": "claude", 
                "priority": 3,
                "schedule": "daily at 10:00, 16:00",
                "session_duration": 45 * 60,  # 45 minutes
                "role": "Release & Operations Director"
            }
        }
        
        # Development agents (from previous system)
        self.development_agents = {
            "developer": {
                "recipe": "recipe-developer.yaml",
                "model": "qwen-coder",
                "continuous": True,
                "priority": 4,
                "role": "24/7 Coding Engine"
            },
            "tester": {
                "recipe": "recipe-tester.yaml",
                "model": "qwen-coder", 
                "schedule": "every 2 hours",
                "priority": 5,
                "role": "Quality Guardian"
            },
            "social": {
                "recipe": "recipe-social.yaml",
                "model": "groq",
                "schedule": "every 6 hours", 
                "priority": 6,
                "role": "Community Builder"
            }
        }
        
        # Combine all agents
        self.all_agents = {**self.strategic_agents, **self.development_agents}
        
        # Strategic coordination state
        self.strategic_context = {}
        self.active_initiatives = []
        self.risk_register = []
        
    def setup_logging(self):
        """Configure comprehensive logging"""
        log_file = self.logs_dir / f"strategic_orchestrator_{datetime.date.today()}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def run_strategic_agent(self, agent_name: str, parameters: Optional[Dict] = None) -> Dict:
        """Run a strategic agent with enhanced coordination"""
        if agent_name not in self.all_agents:
            self.logger.error(f"Unknown agent: {agent_name}")
            return {"status": "error", "message": f"Unknown agent: {agent_name}"}
            
        agent_config = self.all_agents[agent_name]
        recipe_path = self.recipes_dir / agent_config["recipe"]
        
        # Build Goose command with model configuration
        cmd = ["goose", "run", "--recipe", str(recipe_path)]
        
        # Configure model based on agent requirements - using global OpenRouter setup
        model = agent_config["model"]
        if model == "claude":
            # Use default goose configuration for Claude (OpenRouter)
            os.environ["GOOSE_PROVIDER"] = "openrouter"
            os.environ["GOOSE_MODEL"] = "anthropic/claude-3.5-sonnet:beta"
        elif model == "qwen-coder":
            # Use default goose configuration for Qwen (OpenRouter)
            os.environ["GOOSE_PROVIDER"] = "openrouter"
            os.environ["GOOSE_MODEL"] = "qwen/qwen-2.5-coder-32b-instruct"
        elif model == "groq":
            # Use default goose configuration for Llama (OpenRouter)
            os.environ["GOOSE_PROVIDER"] = "openrouter"
            os.environ["GOOSE_MODEL"] = "meta-llama/llama-3.1-70b-instruct"
            
        # Add strategic context as parameters
        if parameters:
            for key, value in parameters.items():
                cmd.extend(["--params", f"{key}={value}"])
                
        # Add strategic context
        if agent_name in self.strategic_agents:
            cmd.extend([
                "--params", f"strategic_context={json.dumps(self.strategic_context)}",
                "--params", f"active_initiatives={json.dumps(self.active_initiatives)}",
                "--params", f"risk_register={json.dumps(self.risk_register)}"
            ])
        
        session_id = f"{agent_name}_strategic_{int(time.time())}"
        
        self.logger.info(f"🎯 Starting strategic {agent_name} session: {session_id}")
        
        try:
            start_time = time.time()
            result = subprocess.run(cmd, capture_output=True, text=True, 
                                  timeout=agent_config.get("session_duration", 3600))
            end_time = time.time()
            
            session_data = {
                "session_id": session_id,
                "agent": agent_name,
                "agent_role": agent_config["role"],
                "start_time": start_time,
                "end_time": end_time, 
                "duration": end_time - start_time,
                "status": "success" if result.returncode == 0 else "error",
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None,
                "strategic_context": self.strategic_context.copy(),
                "model_used": model
            }
            
            # Save session data with strategic categorization
            self.save_strategic_session(session_data)
            
            # Extract strategic insights from successful sessions
            if result.returncode == 0:
                self.extract_strategic_insights(agent_name, session_data)
                self.logger.info(f"✅ Strategic {agent_name} session completed successfully")
            else:
                self.logger.error(f"❌ Strategic {agent_name} session failed: {result.stderr}")
                
            return session_data
            
        except subprocess.TimeoutExpired:
            self.logger.error(f"⏱️ Strategic {agent_name} session timed out")
            return {"status": "timeout", "agent": agent_name, "session_id": session_id}
        except Exception as e:
            self.logger.error(f"💥 Error running strategic {agent_name}: {e}")
            return {"status": "error", "agent": agent_name, "error": str(e)}
    
    def save_strategic_session(self, session_data: Dict):
        """Save session data with strategic categorization"""
        agent_name = session_data["agent"]
        
        # Save to agent-specific directory
        agent_dir = self.outputs_dir / "strategic" / agent_name
        agent_dir.mkdir(parents=True, exist_ok=True)
        
        session_file = agent_dir / f"{session_data['session_id']}.json"
        with open(session_file, 'w') as f:
            json.dump(session_data, f, indent=2, default=str)
            
        # Save to daily summary
        daily_file = self.outputs_dir / "strategic" / f"daily_{datetime.date.today()}.json"
        daily_sessions = []
        if daily_file.exists():
            with open(daily_file, 'r') as f:
                daily_sessions = json.load(f)
                
        daily_sessions.append({
            "session_id": session_data["session_id"],
            "agent": agent_name,
            "status": session_data["status"],
            "duration": session_data["duration"],
            "timestamp": session_data["start_time"]
        })
        
        with open(daily_file, 'w') as f:
            json.dump(daily_sessions, f, indent=2, default=str)
    
    def extract_strategic_insights(self, agent_name: str, session_data: Dict):
        """Extract and integrate strategic insights from agent sessions"""
        output = session_data.get("output", "")
        
        # Simple keyword-based insight extraction (could be enhanced with NLP)
        insights = {
            "timestamp": datetime.datetime.now().isoformat(),
            "agent": agent_name,
            "session_id": session_data["session_id"]
        }
        
        # Extract different types of insights based on agent role
        if agent_name == "strategy_chief":
            insights["type"] = "strategic_decision"
            insights["priority_changes"] = "high" in output.lower()
            insights["risk_identified"] = "risk" in output.lower()
            
        elif agent_name == "marketing_growth":
            insights["type"] = "marketing_opportunity"  
            insights["campaign_ideas"] = "campaign" in output.lower()
            insights["growth_tactics"] = "growth" in output.lower()
            
        elif agent_name == "research_intelligence":
            insights["type"] = "market_intelligence"
            insights["competitor_analysis"] = "competitor" in output.lower()
            insights["technology_trends"] = "trend" in output.lower()
            
        elif agent_name == "release_operations":
            insights["type"] = "operational_excellence"
            insights["quality_metrics"] = "quality" in output.lower()
            insights["release_readiness"] = "release" in output.lower()
            
        # Store insights for cross-agent coordination
        insights_file = self.outputs_dir / "strategic" / "insights.json"
        all_insights = []
        if insights_file.exists():
            with open(insights_file, 'r') as f:
                all_insights = json.load(f)
                
        all_insights.append(insights)
        
        # Keep only last 100 insights
        if len(all_insights) > 100:
            all_insights = all_insights[-100:]
            
        with open(insights_file, 'w') as f:
            json.dump(all_insights, f, indent=2)
    
    def strategic_morning_briefing(self):
        """Coordinate morning strategic briefing across all strategic agents"""
        self.logger.info("🌅 Starting Strategic Morning Briefing")
        
        briefing_context = {
            "date": str(datetime.date.today()),
            "briefing_type": "morning_strategic",
            "focus_areas": ["market_analysis", "competitive_intelligence", "operational_status"]
        }
        
        # Run strategic agents in coordinated sequence
        briefing_results = {}
        
        # 1. Research & Intelligence first (information gathering)
        self.logger.info("📊 Research & Intelligence briefing...")
        research_result = self.run_strategic_agent("research_intelligence", {
            "research_focus": "market",
            "urgency_level": "immediate",
            "stakeholder_focus": "strategic_team"
        })
        briefing_results["research"] = research_result
        
        # 2. Strategy Chief analysis and coordination
        self.logger.info("🎯 Chief Strategy Officer briefing...")
        strategy_result = self.run_strategic_agent("strategy_chief", {
            "strategic_focus": "market",
            "time_horizon": "30d",
            "coordination_mode": "morning_briefing"
        })
        briefing_results["strategy"] = strategy_result
        
        # 3. Marketing & Growth tactical planning
        self.logger.info("📈 Marketing & Growth briefing...")
        marketing_result = self.run_strategic_agent("marketing_growth", {
            "campaign_focus": "awareness", 
            "content_type": "technical",
            "audience_segment": "developers"
        })
        briefing_results["marketing"] = marketing_result
        
        # 4. Release & Operations status  
        self.logger.info("⚙️ Release & Operations briefing...")
        operations_result = self.run_strategic_agent("release_operations", {
            "operation_focus": "quality",
            "priority_level": "high", 
            "release_phase": "planning"
        })
        briefing_results["operations"] = operations_result
        
        # Save briefing summary
        briefing_summary = {
            "date": str(datetime.date.today()),
            "briefing_type": "strategic_morning",
            "participants": list(briefing_results.keys()),
            "results": briefing_results,
            "next_actions": self.extract_next_actions(briefing_results),
            "risk_assessment": self.assess_strategic_risks(briefing_results)
        }
        
        briefing_file = self.outputs_dir / "strategic" / f"morning_briefing_{datetime.date.today()}.json"
        with open(briefing_file, 'w') as f:
            json.dump(briefing_summary, f, indent=2, default=str)
        
        self.logger.info("✅ Strategic Morning Briefing completed")
        return briefing_summary
    
    def extract_next_actions(self, briefing_results: Dict) -> List[Dict]:
        """Extract actionable next steps from strategic briefing"""
        next_actions = []
        
        for agent, result in briefing_results.items():
            if result.get("status") == "success":
                output = result.get("output", "")
                
                # Simple action extraction (could be enhanced)
                if "action" in output.lower() or "recommend" in output.lower():
                    next_actions.append({
                        "source_agent": agent,
                        "action_type": "recommendation",
                        "priority": "high" if "urgent" in output.lower() else "normal",
                        "extracted_from": f"session_{result.get('session_id', 'unknown')}"
                    })
        
        return next_actions
    
    def assess_strategic_risks(self, briefing_results: Dict) -> Dict:
        """Assess strategic risks from briefing results"""
        risk_assessment = {
            "overall_risk_level": "low",
            "identified_risks": [],
            "mitigation_required": False
        }
        
        for agent, result in briefing_results.items():
            if result.get("status") == "error":
                risk_assessment["identified_risks"].append({
                    "type": "agent_failure",
                    "agent": agent,
                    "severity": "medium"
                })
                risk_assessment["mitigation_required"] = True
        
        return risk_assessment
    
    def schedule_strategic_operations(self):
        """Schedule all strategic agent operations"""
        # Morning strategic briefing
        schedule.every().day.at("08:00").do(self.strategic_morning_briefing)
        
        # Individual agent schedules
        schedule.every().day.at("14:00").do(self.run_strategic_agent, "strategy_chief", {"strategic_focus": "technical"})
        schedule.every().day.at("20:00").do(self.run_strategic_agent, "strategy_chief", {"strategic_focus": "business"})
        
        # Marketing every 4 hours
        schedule.every(4).hours.do(self.run_strategic_agent, "marketing_growth")
        
        # Research daily
        schedule.every().day.at("15:00").do(self.run_strategic_agent, "research_intelligence")
        
        # Operations twice daily  
        schedule.every().day.at("16:00").do(self.run_strategic_agent, "release_operations")
        
        self.logger.info("📅 Strategic operations scheduled")
    
    def run_strategic_system(self):
        """Run the complete strategic system"""
        self.logger.info("🚀 Starting zkSDK Strategic Management System")
        
        # Schedule strategic operations
        self.schedule_strategic_operations()
        
        # Start continuous developer (from original system) in background
        developer_thread = threading.Thread(target=self.continuous_developer, daemon=True)
        developer_thread.start()
        
        # Start scheduler in main thread
        self.run_scheduler()
        
    def continuous_developer(self):
        """Keep the 24/7 developer running (from original system)"""
        while True:
            try:
                current_hour = datetime.datetime.now().hour
                if 0 <= current_hour < 6:
                    focus_mode = "features"
                elif 6 <= current_hour < 12:
                    focus_mode = "bugs"
                elif 12 <= current_hour < 18:
                    focus_mode = "integrations"
                else:
                    focus_mode = "testing"
                
                session_result = self.run_strategic_agent("developer", {
                    "focus_mode": focus_mode,
                    "session_duration": "4 hours"
                })
                
                if session_result["status"] != "success":
                    time.sleep(30 * 60)  # Wait 30 minutes on failure
                    continue
                    
                time.sleep(15 * 60)  # 15-minute break
                
            except Exception as e:
                self.logger.error(f"💥 Error in continuous developer: {e}")
                time.sleep(60)
    
    def run_scheduler(self):
        """Run the strategic scheduler"""
        self.logger.info("⏰ Starting strategic scheduler")
        
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)
            except Exception as e:
                self.logger.error(f"💥 Scheduler error: {e}")
                time.sleep(60)

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="zkSDK Strategic Management System")
    parser.add_argument("--mode", choices=["full", "briefing", "agent"], 
                       default="full", help="Run mode")
    parser.add_argument("--agent", help="Run specific strategic agent")
    
    args = parser.parse_args()
    
    orchestrator = ZkSDKStrategicOrchestrator()
    
    if args.mode == "full":
        orchestrator.run_strategic_system()
    elif args.mode == "briefing":
        result = orchestrator.strategic_morning_briefing()
        print(json.dumps(result, indent=2, default=str))
    elif args.mode == "agent" and args.agent:
        result = orchestrator.run_strategic_agent(args.agent)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()