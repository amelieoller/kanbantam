import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import Input from '_atoms/Input';
import Button from '_atoms/Button';
import { attemptUpdateUser } from '_thunks/user';
import { validateName } from '_utils/validation';

function GeneralProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [firstNameEdited, setFirstNameEdited] = useState(false);
  const [lastNameEdited, setLastNameEdited] = useState(false);
  const [bioEdited, setBioEdited] = useState(false);
  const [profilePicEdited, setProfilePicEdited] = useState(false);

  const resetState = () => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setBio(user.bio || '');
    setProfilePic(user.profilePic || '');
    setFirstNameEdited(false);
    setLastNameEdited(false);
    setBioEdited(false);
    setProfilePicEdited(false);
  };

  useEffect(() => {
    resetState();
  }, [user.firstName, user.lastName, user.bio, user.profilePic]);

  const updateFirstName = (e) => {
    if (validateName(e.target.value)) {
      setFirstName(e.target.value);
      setFirstNameEdited(true);
    }
  };

  const updateLastName = (e) => {
    if (validateName(e.target.value)) {
      setLastName(e.target.value);
      setLastNameEdited(true);
    }
  };

  const updateBio = (e) => {
    setBio(e.target.value);
    setBioEdited(true);
  };

  const updateProfilePic = (value) => {
    setProfilePic(value);
    setProfilePicEdited(true);
  };

  const save = () => {
    const updatedUser = {};

    if (firstNameEdited) {
      updatedUser.first_name = firstName;
    }
    if (lastNameEdited) {
      updatedUser.last_name = lastName;
    }
    if (profilePicEdited) {
      updatedUser.profile_pic = profilePic;
    }
    if (bioEdited) {
      updatedUser.bio = bio;
    }

    if (!R.isEmpty(updatedUser)) {
      dispatch(attemptUpdateUser(updatedUser)).catch(R.identity);
    }
  };

  const edited = firstNameEdited || lastNameEdited || bioEdited || profilePicEdited;

  return (
    <StyledProfile>
      <h3 className="title is-3 has-text-centered">{user.usernameCase}</h3>
      <ProfilePicture
        className="profile-img"
        src={profilePic || '/images/default-profile.png'}
        alt="Profile"
      />

      <Input
        label="Profile URL"
        handleOnBlur={updateProfilePic}
        defaultValue={profilePic}
      />
      <Input label="First Name" handleOnBlur={updateFirstName} defaultValue={firstName} />
      <Input label="Last Name" handleOnBlur={updateLastName} defaultValue={lastName} />
      <Input label="Bio" handleOnBlur={updateBio} defaultValue={bio} />

      <Button disabled={!edited} onClick={save}>
        Save
      </Button>
    </StyledProfile>
  );
}

const StyledProfile = styled.div``;

const ProfilePicture = styled.img`
  width: 100%;
`;

export default GeneralProfile;
