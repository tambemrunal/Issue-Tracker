from phi.agent import Agent
from phi.tools.crawl4ai_tools import Crawl4aiTools
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini

agent = Agent(
    model=Gemini(id="gemini-2.5-flash"),
    tools=[Crawl4aiTools(max_length=None)], show_tool_calls=True, debug_mode=True)
agent.print_response("Search web page: 'https://www.pmc.gov.in/en/pmc-officers' and get me the contact details for garbage collection or any related contact mail address department in contact us ", markdown=True)