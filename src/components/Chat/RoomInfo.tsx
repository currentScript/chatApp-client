import React from "react";
import useStore from "../../zustand/store";
import { gql, useQuery } from "@apollo/client";

const LOAD_ROOM_QUERY = gql`
  query loadRoom($roomId: Float!) {
    loadRoom(roomId: $roomId) {
      id
      room {
        name
        created
        image
      }
    }
  }
`;

export const RoomInfo: React.FC = () => {
  const setViewRoomInfo = useStore((state) => state.setViewRoomInfo);
  const currentChat = useStore((state) => state.currentChat);

  let { data: room, loading } = useQuery(LOAD_ROOM_QUERY, {
    // @ts-ignore not sure why but currentChat isn't a number
    variables: { roomId: parseInt(currentChat, 10) },
  });

  const closeRoomInfo = () => {
    setViewRoomInfo(false);
  };

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const created = new Date(room?.loadRoom.room.created);

  // @ts-ignore
  const roomAge = Math.round(Math.abs((created - now) / oneDay));

  const roomAgeDetailed =
    roomAge >= 365
      ? {
          years: Math.round(roomAge / 365),
          days: (roomAge % 365) % 7,
        }
      : {
          years: null,
          days: roomAge,
        };

  if (loading) {
    return (
      <div className="roomInfo">
        <p>loading ...</p>
      </div>
    );
  }

  return (
    <div className="roomInfo">
      <header>
        <button onClick={closeRoomInfo}>X</button>
      </header>
      <h1>{room.loadRoom.room.name}</h1>
      <img src={room.loadRoom.room.image ? room.loadRoom.image : ""} alt="" />

      <div>
        <h3>Room age:</h3>
        {roomAgeDetailed.years && <p>Years: {roomAgeDetailed.years}</p>}
        <p>Days: {roomAgeDetailed.days}</p>
      </div>
    </div>
  );
};
