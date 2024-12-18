local hs = game:GetService("HttpService")
local banURL = 'LINK TO YOUR GLITCH PROJECT' -- Link for url of Glitch project
local subUrlForBans = 'SUB URL FOR BANS' -- Sub bans url that you set in Glitch
local subUrlForGettingUsernames = 'get-username-from-id'

while true do
	wait(1)
	local playerIDS = {}
	for i,v in pairs(game.Players:GetPlayers()) do
		table.insert(playerIDS, v.UserId)
	end
	local callBack = hs:JSONDecode(hs:GetAsync(banURL .. subUrlForBans))
	for i,p in pairs(callBack) do
		if(table.find(playerIDS, p._userID)) then
			local username = hs:GetAsync(banURL .. subUrlForGettingUsernames .. "?id=" .. p._userID)
			local player = game.Players:FindFirstChild(username)
			player:Kick("You're banned from this game for: " .. p._reason)
		end
	end
	wait(1)
end
