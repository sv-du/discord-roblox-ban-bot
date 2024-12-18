local hs = game:GetService("HttpService")
local banURL = 'LINK TO YOUR GLITCH PROJECT' -- Link for url of Glitch project
local subUrl = 'SUB URL FOR BANS' -- Sub bans url that you set in Glitch

game.Players.PlayerAdded:Connect(function(plr)
	local callBack = hs:JSONDecode(hs:GetAsync(banURL .. subUrl))
	local plrID = plr.UserId
	for i,v in pairs(callBack) do
		if(v._userID == plrID) then
			plr:Kick("You're banned from this game for the reason for: " .. v._reason)
		end
	end
end)
