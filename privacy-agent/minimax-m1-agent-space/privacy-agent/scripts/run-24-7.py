#!/usr/bin/env python3
"""
zkSDK 24/7 Autonomous Development System
Coordinates all agents for continuous development
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

class ZkSDK247System:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.recipes_dir = self.base_dir
        self.outputs_dir = self.base_dir / "outputs"
        self.logs_dir = self.outputs_dir / "logs"
        
        # Ensure directories exist
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Set up logging
        self.setup_logging()
        
        # Agent configurations
        self.agents = {
            "developer": {
                "recipe": "recipe-developer.yaml",
                "model": "qwen-coder",
                "continuous": True,  # Runs 24/7
                "session_duration": 4 * 60 * 60,  # 4 hours
                "break_duration": 15 * 60,  # 15 minutes
                "priority": 1
            },
            "tester": {
                "recipe": "recipe-tester.yaml", 
                "model": "qwen-coder",
                "continuous": False,
                "schedule": "every 2 hours",
                "priority": 2
            },
            "social": {
                "recipe": "recipe-social.yaml",
                "model": "groq", 
                "continuous": False,
                "schedule": "every 6 hours",
                "priority": 3
            },
            "orchestrator": {
                "recipe": "recipe-orchestrator.yaml",
                "model": "claude",
                "continuous": False, 
                "schedule": "daily at 09:00, 13:00, 18:00",
                "priority": 4
            },
            "research": {
                "recipe": "recipe-research.yaml",
                "model": "claude",
                "continuous": False,
                "schedule": "weekly monday",
                "priority": 5
            }
        }
        
        # Track running sessions
        self.active_sessions = {}
        self.session_stats = {}
        
    def setup_logging(self):
        """Configure logging system"""
        log_file = self.logs_dir / f"zkSDK_247_{datetime.date.today()}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def run_agent_session(self, agent_name: str, parameters: Optional[Dict] = None) -> Dict:
        """Run a single agent session"""
        if agent_name not in self.agents:
            self.logger.error(f"Unknown agent: {agent_name}")
            return {"status": "error", "message": f"Unknown agent: {agent_name}"}
            
        agent_config = self.agents[agent_name]
        recipe_path = self.recipes_dir / agent_config["recipe"]
        
        # Build Goose command
        cmd = ["goose", "run", "--recipe", str(recipe_path)]
        
        # Add model configuration
        if "model" in agent_config:
            model = agent_config["model"]
            if model == "qwen-coder":
                os.environ["GOOSE_MODEL"] = "ai/qwen3:30B-A3B-Q4_K_M"
                os.environ["GOOSE_PROVIDER"] = "openai"
            elif model == "groq":
                os.environ["GOOSE_PROVIDER"] = "groq"
                os.environ["GOOSE_MODEL"] = "llama3-groq"
            elif model == "claude":
                os.environ["GOOSE_PROVIDER"] = "anthropic"  
                os.environ["GOOSE_MODEL"] = "claude-3-sonnet-20241022"
        
        # Add parameters
        if parameters:
            for key, value in parameters.items():
                cmd.extend(["--param", f"{key}={value}"])
                
        # For continuous agents, run in background
        if agent_config.get("continuous", False):
            cmd.append("--background")
            
        session_id = f"{agent_name}_{int(time.time())}"
        
        self.logger.info(f"🚀 Starting {agent_name} session: {session_id}")
        
        try:
            start_time = time.time()
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
            end_time = time.time()
            
            session_data = {
                "session_id": session_id,
                "agent": agent_name,
                "start_time": start_time,
                "end_time": end_time,
                "duration": end_time - start_time,
                "status": "success" if result.returncode == 0 else "error",
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None
            }
            
            # Save session data
            self.save_session_data(session_data)
            
            if result.returncode == 0:
                self.logger.info(f"✅ {agent_name} session completed successfully")
            else:
                self.logger.error(f"❌ {agent_name} session failed: {result.stderr}")
                
            return session_data
            
        except subprocess.TimeoutExpired:
            self.logger.error(f"⏱️ {agent_name} session timed out")
            return {"status": "timeout", "agent": agent_name, "session_id": session_id}
        except Exception as e:
            self.logger.error(f"💥 Error running {agent_name}: {e}")
            return {"status": "error", "agent": agent_name, "error": str(e)}
    
    def save_session_data(self, session_data: Dict):
        """Save session data to outputs"""
        session_file = self.outputs_dir / "sessions" / f"{session_data['session_id']}.json"
        session_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(session_file, 'w') as f:
            json.dump(session_data, f, indent=2, default=str)
            
    def continuous_developer(self):
        """Run developer agent continuously with breaks"""
        self.logger.info("🔄 Starting continuous developer agent (24/7 coding)")
        
        while True:
            try:
                # Determine focus mode based on time
                current_hour = datetime.datetime.now().hour
                if 0 <= current_hour < 6:
                    focus_mode = "features"
                elif 6 <= current_hour < 12:
                    focus_mode = "bugs"
                elif 12 <= current_hour < 18:
                    focus_mode = "integrations"
                else:
                    focus_mode = "testing"
                
                # Run development session
                session_result = self.run_agent_session("developer", {
                    "focus_mode": focus_mode,
                    "session_duration": "4 hours"
                })
                
                if session_result["status"] == "success":
                    self.logger.info(f"🎯 Developer completed {focus_mode} session")
                else:
                    self.logger.error(f"⚠️ Developer session failed, retrying in 30 minutes")
                    time.sleep(30 * 60)  # Wait 30 minutes before retry
                    continue
                
                # Take a 15-minute break
                self.logger.info("😴 Developer taking 15-minute break")
                time.sleep(15 * 60)
                
            except Exception as e:
                self.logger.error(f"💥 Error in continuous developer: {e}")
                time.sleep(60)  # Wait 1 minute before retry
    
    def schedule_agents(self):
        """Set up scheduled agent runs"""
        # Tester every 2 hours
        schedule.every(2).hours.do(self.run_agent_session, "tester")
        
        # Social media every 6 hours  
        schedule.every(6).hours.do(self.run_agent_session, "social")
        
        # Orchestrator 3 times daily
        schedule.every().day.at("09:00").do(self.run_agent_session, "orchestrator", {"coordination_mode": "daily"})
        schedule.every().day.at("13:00").do(self.run_agent_session, "orchestrator", {"coordination_mode": "midday"}) 
        schedule.every().day.at("18:00").do(self.run_agent_session, "orchestrator", {"coordination_mode": "evening"})
        
        # Research agent every Monday
        schedule.every().monday.at("09:00").do(self.run_agent_session, "research")
        
        self.logger.info("📅 Agent schedules configured")
        
    def run_scheduler(self):
        """Run the scheduled tasks"""
        self.logger.info("⏰ Starting scheduler for timed agents")
        
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except Exception as e:
                self.logger.error(f"💥 Scheduler error: {e}")
                time.sleep(60)
    
    def generate_daily_report(self):
        """Generate daily progress report"""
        self.logger.info("📊 Generating daily progress report")
        
        today = datetime.date.today()
        session_files = list((self.outputs_dir / "sessions").glob(f"*_{today}_*.json"))
        
        report = {
            "date": str(today),
            "total_sessions": len(session_files),
            "agents_active": {},
            "key_metrics": {},
            "summary": ""
        }
        
        # Analyze session data
        for session_file in session_files:
            with open(session_file) as f:
                session_data = json.load(f)
                agent = session_data["agent"]
                
                if agent not in report["agents_active"]:
                    report["agents_active"][agent] = 0
                report["agents_active"][agent] += 1
        
        # Save report
        report_file = self.outputs_dir / "reports" / f"daily_{today}.json"
        report_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
            
        self.logger.info(f"📈 Daily report saved: {report_file}")
        return report
    
    def start_system(self):
        """Start the complete 24/7 system"""
        self.logger.info("🚀 Starting zkSDK 24/7 Autonomous Development System")
        
        # Schedule agents
        self.schedule_agents()
        
        # Schedule daily report
        schedule.every().day.at("23:59").do(self.generate_daily_report)
        
        # Start continuous developer in background thread
        developer_thread = threading.Thread(target=self.continuous_developer, daemon=True)
        developer_thread.start()
        
        # Start scheduler in main thread
        self.run_scheduler()

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="zkSDK 24/7 Development System")
    parser.add_argument("--mode", choices=["full", "agent", "report"], 
                       default="full", help="Run mode")
    parser.add_argument("--agent", help="Run specific agent")
    parser.add_argument("--focus", help="Focus mode for agent")
    
    args = parser.parse_args()
    
    system = ZkSDK247System()
    
    if args.mode == "full":
        system.start_system()
    elif args.mode == "agent" and args.agent:
        params = {"focus_mode": args.focus} if args.focus else None
        result = system.run_agent_session(args.agent, params)
        print(json.dumps(result, indent=2))
    elif args.mode == "report":
        report = system.generate_daily_report()
        print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()