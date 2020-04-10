import React, { useState } from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import Stats from "../components/game/Stats";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { ON_GAME } from "../graphql/subscriptions";

export default ({ onlineUsers, me }) => {
  const { loading, error, data } = me;
  const { id: gameId } = useParams();
  const history = useHistory();
  const [opponentStats, setOpponentStats] = useState(null);
  const [ownStats, setownStats] = useState(null);

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      const self = e.you,
        opponent = self === "p1" ? "p2" : "p1";

      if (e.status === "initializing") {
        console.log("initializing");
      } else if (e.status === "ready") {
        console.log("ready");
      } else if (e.status === "ongoing") {
        setownStats(e[self]);
        setOpponentStats(e[opponent]);
      } else if (e.status === "over") {
        // display victory/loss modal
        history.push("/");
      }
    },
  });

  if (loading || error || !data) return null;

  return (
    <div className="main">
      <NavBar noData={true} />
      <div className="game-screen">
        <div className="game-left">
          <div className="code-editor-wrapper">
            <CodeEditor gameId={gameId} me={data.me} />
          </div>
          <div className="stats-wrapper">
            <div className="stats-players">
              <Stats ownStats={ownStats} defStats={"Own Stats"} />
            </div>
            <div className="stats-players">
              <Stats
                opponentStats={opponentStats}
                defStats={"Opponent Stats"}
              />
            </div>
          </div>
        </div>
        <div className="game-right">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} me={me} />
          </div>
        </div>
      </div>
    </div>
  );
};
