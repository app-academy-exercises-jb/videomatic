import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { ON_INVITATION } from "../../graphql/subscriptions";
import {
  ACCEPT_INVITE,
  DECLINE_INVITE,
  SPECTATE_USER,
} from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const SideBar = ({ data }) => {
  ReactModal.setAppElement("#root");

  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [spectateModalOpen, setSpectateModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(data.users[0]);

  const [acceptInvite] = useMutation(ACCEPT_INVITE);
  const [declineInvite] = useMutation(DECLINE_INVITE);
  const [spectate] = useMutation(SPECTATE_USER);

  const history = useHistory();

  useSubscription(ON_INVITATION, {
    fetchPolicy: "network-only",
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.invitationEvent;
      console.log(e);
      if (e.status === "inviting") {
        handleModalOpen(e.inviter);
      } else if (e.status === "declined") {
        // setSelectedUser(e.invitee)
        // setDeclineModalOpen(true)
        // // => "invitee declined your invite"
        alert(`${e.invitee.username} declined`);
      } else if (e.status === "accepted") {
        // Go to the game screen
        history.push(`/game/${e.gameId}`);
      } else if (e.status === "rejected") {
        if (e.reason === "That player's already in another game!") {
          setSelectedUser(e.invitee);
          setSpectateModalOpen(true);
        } else {
          alert(`Sorry! ${e.reason}`);
        }
      }
    },
  });

  const handleModalOpen = (user) => {
    setSelectedUser(user);
    setChallengeModalOpen(true);
  };

  const handleAccept = (user) => {
    acceptInvite({ variables: { inviter: user._id } });
    setChallengeModalOpen(false);
  };

  const handleDecline = (user) => {
    declineInvite({ variables: { inviter: user._id } });
    setChallengeModalOpen(false);
  };

  const spectateUser = async (user) => {
    const {
      data: { spectateUser: gameId },
    } = await spectate({ variables: { player: user._id } });
    setSpectateModalOpen(false);
    if (gameId === "not ok") return;
    history.push(`/game/${gameId}`);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers data={data} handleModalOpen={handleModalOpen} />
      </div>
      <ReactModal
        isOpen={challengeModalOpen}
        className="modal-overlay"
        shouldCloseOnEsc={true}
        onRequestClose={() => handleDecline(selectedUser)}
      >
        <div className="modal">
          <div className="modal-info">
            <h1>{selectedUser && selectedUser.username}</h1>
            <div>
              has challenged you to a <p>CODE DUEL!</p>
            </div>
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline"
              onClick={() => handleDecline(selectedUser)}
            >
              Decline
            </button>
            <button
              className="modal-accept"
              onClick={() => handleAccept(selectedUser)}
            >
              Accept
            </button>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        isOpen={spectateModalOpen}
        className="modal-overlay"
        shouldCloseOnEsc={true}
        onRequestClose={() => setSpectateModalOpen(false)}
      >
        <div className="modal">
          <div className="modal-info">
            <h1>{selectedUser && selectedUser.username}</h1>
            <div>
              <p>is already in a duel!</p>
              Would you like to spectate?
            </div>
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline"
              onClick={() => setSpectateModalOpen(false)}
            >
              Decline
            </button>
            <button
              className="modal-accept"
              onClick={() => spectateUser(selectedUser)}
            >
              Accept
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default SideBar;
