#!/usr/bin/env python3
"""
Privacy Agent Orchestrator
Coordinates all agent activities for the zkSDK autonomous development system
"""

import subprocess
import json
import datetime
import time
import os
from pathlib import Path
from typing import Dict, List, Optional
import logging
import schedule

class PrivacyAgentOrchestrator:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.recipes_dir = self.base_dir / "recipes"
        self.memory_dir = self.base_dir / "memory"
        self.outputs_dir = self.base_dir / "outputs"
        self.logs_dir = self.outputs_dir / "logs"
        
        # Create directories if they don't exist
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Set up logging
        self.setup_logging()
        
        # Agent configuration
        self.agents = {
            "orchestrator": {"recipe": "orchestrator.yaml", "priority": 1},
            "product-manager": {"recipe": "product-manager.yaml", "priority": 2},
            "developer": {"recipe": "developer.yaml", "priority": 3},
            "tester": {"recipe": "tester.yaml", "priority": 4},
            "content-creator": {"recipe": "content-creator.yaml", "priority": 5}
        }
        
    def setup_logging(self):
        """Set up logging configuration"""
        log_file = self.logs_dir / f"orchestrator_{datetime.date.today()}.log"
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def run_agent(self, agent_name: str, background: bool = False, 
                  parameters: Optional[Dict] = None) -> Dict:
        """Run a Goose agent with specified recipe"""
        if agent_name not in self.agents:
            self.logger.error(f"Unknown agent: {agent_name}")
            return {"status": "error", "message": f"Unknown agent: {agent_name}"}
            
        recipe_path = self.recipes_dir / self.agents[agent_name]["recipe"]
        
        # Build command
        cmd = ["goose", "run", "--recipe", str(recipe_path)]
        
        if background:
            cmd.append("--background")
            
        # Add parameters if provided
        if parameters:
            for key, value in parameters.items():
                cmd.extend(["--param", f"{key}={value}"])
        
        self.logger.info(f"Running agent: {agent_name}")
        self.logger.debug(f"Command: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
            
            if result.returncode == 0:
                self.logger.info(f"Agent {agent_name} completed successfully")
                return {
                    "status": "success",
                    "agent": agent_name,
                    "output": result.stdout
                }
            else:
                self.logger.error(f"Agent {agent_name} failed: {result.stderr}")
                return {
                    "status": "error",
                    "agent": agent_name,
                    "error": result.stderr
                }
                
        except subprocess.TimeoutExpired:
            self.logger.error(f"Agent {agent_name} timed out")
            return {"status": "timeout", "agent": agent_name}
        except Exception as e:
            self.logger.error(f"Error running agent {agent_name}: {e}")
            return {"status": "error", "agent": agent_name, "error": str(e)}
    
    def save_to_memory(self, agent_name: str, data: Dict):
        """Save agent data to memory"""
        memory_file = self.memory_dir / agent_name / f"{datetime.date.today()}.json"
        memory_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(memory_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
            
        self.logger.debug(f"Saved memory for {agent_name}")
        
    def load_from_memory(self, agent_name: str) -> Optional[Dict]:
        """Load agent data from memory"""
        memory_file = self.memory_dir / agent_name / f"{datetime.date.today()}.json"
        
        if memory_file.exists():
            with open(memory_file, 'r') as f:
                return json.load(f)
        return None
    
    def daily_standup(self):
        """Coordinate daily agent activities"""
        self.logger.info(f"🌅 Starting daily standup - {datetime.datetime.now()}")
        
        standup_data = {
            "date": str(datetime.date.today()),
            "start_time": str(datetime.datetime.now()),
            "agents": {}
        }
        
        # 1. Run orchestrator to plan the day
        self.logger.info("Running orchestrator for daily planning...")
        orch_result = self.run_agent("orchestrator", background=True, 
                                    parameters={"coordination_type": "daily"})
        standup_data["agents"]["orchestrator"] = orch_result
        
        # 2. Run product manager to review priorities
        self.logger.info("Product Manager reviewing priorities...")
        pm_result = self.run_agent("product-manager", background=True)
        standup_data["agents"]["product-manager"] = pm_result
        
        # 3. Run developer to work on highest priority
        self.logger.info("Developer starting work...")
        dev_result = self.run_agent("developer", background=True)
        standup_data["agents"]["developer"] = dev_result
        
        # 4. Run tester to validate changes
        self.logger.info("Tester validating changes...")
        test_result = self.run_agent("tester", background=True)
        standup_data["agents"]["tester"] = test_result
        
        # 5. Run content creator to document progress
        self.logger.info("Content Creator documenting progress...")
        content_result = self.run_agent("content-creator", background=True)
        standup_data["agents"]["content-creator"] = content_result
        
        standup_data["end_time"] = str(datetime.datetime.now())
        
        # Save standup results
        self.save_to_memory("shared", standup_data)
        
        self.logger.info("✅ Daily standup complete")
        return standup_data
    
    def weekly_release(self):
        """Coordinate weekly release process"""
        self.logger.info(f"📦 Starting weekly release - {datetime.datetime.now()}")
        
        release_data = {
            "date": str(datetime.date.today()),
            "start_time": str(datetime.datetime.now()),
            "steps": []
        }
        
        # 1. Run tests
        self.logger.info("Running comprehensive tests...")
        test_result = self.run_agent("tester", background=False,
                                    parameters={"test_type": "integration"})
        release_data["steps"].append({"step": "testing", "result": test_result})
        
        # 2. Generate release notes
        self.logger.info("Generating release notes...")
        content_result = self.run_agent("content-creator", background=False,
                                       parameters={"content_type": "release_notes"})
        release_data["steps"].append({"step": "release_notes", "result": content_result})
        
        # 3. Coordinate release
        self.logger.info("Coordinating release...")
        orch_result = self.run_agent("orchestrator", background=False,
                                    parameters={"coordination_type": "release"})
        release_data["steps"].append({"step": "coordination", "result": orch_result})
        
        release_data["end_time"] = str(datetime.datetime.now())
        
        # Save release results
        self.save_to_memory("releases", release_data)
        
        self.logger.info("✅ Weekly release complete")
        return release_data
    
    def generate_report(self):
        """Generate daily progress report"""
        self.logger.info("Generating daily report...")
        
        report = {
            "date": str(datetime.date.today()),
            "agents_status": {},
            "key_accomplishments": [],
            "issues": [],
            "next_steps": []
        }
        
        # Collect status from each agent's memory
        for agent_name in self.agents:
            agent_memory = self.load_from_memory(agent_name)
            if agent_memory:
                report["agents_status"][agent_name] = "active"
            else:
                report["agents_status"][agent_name] = "no_activity"
        
        # Save report
        report_file = self.outputs_dir / "reports" / f"daily_{datetime.date.today()}.json"
        report_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
            
        self.logger.info(f"Report saved to {report_file}")
        return report
    
    def schedule_tasks(self):
        """Schedule recurring tasks"""
        # Daily tasks
        schedule.every().day.at("09:00").do(self.daily_standup)
        schedule.every().day.at("18:00").do(self.generate_report)
        
        # Weekly tasks
        schedule.every().friday.at("14:00").do(self.weekly_release)
        
        self.logger.info("Tasks scheduled")
        
    def run_scheduler(self):
        """Run the scheduler"""
        self.logger.info("Starting scheduler...")
        self.schedule_tasks()
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Privacy Agent Orchestrator")
    parser.add_argument("--mode", choices=["scheduler", "standup", "release", "report"],
                       default="scheduler", help="Execution mode")
    parser.add_argument("--agent", help="Run specific agent")
    parser.add_argument("--background", action="store_true", help="Run in background")
    
    args = parser.parse_args()
    
    orchestrator = PrivacyAgentOrchestrator()
    
    if args.mode == "scheduler":
        orchestrator.run_scheduler()
    elif args.mode == "standup":
        orchestrator.daily_standup()
    elif args.mode == "release":
        orchestrator.weekly_release()
    elif args.mode == "report":
        orchestrator.generate_report()
    elif args.agent:
        result = orchestrator.run_agent(args.agent, args.background)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()