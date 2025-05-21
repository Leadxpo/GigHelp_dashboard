import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Grid, Chip, Paper ,Stack,Card,Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tables from '../../components/Users/MoreDetailsTables';
import { useLocation } from 'react-router-dom';


const UserDetails = () => {

  const location = useLocation();
  const { userDetails } = location?.state || {};
  console.log(userDetails,"abcd")
  

  const [statuses, setStatuses] = useState(
    Array.isArray(userDetails?.identityProof)
      ? userDetails.identityProof.map(() => null)
      : []
  );

  let identityProofs = [];

  if (Array.isArray(userDetails?.identityProof)) {
    identityProofs = userDetails.identityProof;
  } else if (typeof userDetails?.identityProof === 'string') {
    try {
      identityProofs = JSON.parse(userDetails.identityProof || '[]');
    } catch (error) {
      console.error('Invalid JSON in identityProof:', error);
    }
  }

  const handleStatusChange = (index, status) => {
    const newStatuses = [...statuses];
    newStatuses[index] = status;
    setStatuses(newStatuses);
  };


  return (
    <Box p={0}>

      {/* Card Layout */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          User ID :{userDetails.userId}
        </Typography>
        <Chip label="Approved" color="success" sx={{ fontWeight: 'bold', fontSize: '16px' }} />
      </Box>
        <Grid container spacing={4}>
    {/* Profile Image */}
    <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
      {userDetails?.profilePic && (

        <Avatar
          alt="User Profile"
          src={`http://localhost:3001/storege/userdp/${userDetails.profilePic}`}
          sx={{ width: 200, height: 200 }}
        />
      )}
    </Grid>

          {/* User Info */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[
                ['Name', userDetails.userName],
                ['Phone number',userDetails.phoneNumber],
                ['Email', userDetails.email],
                ['Number of Task', '675'],
                ['Number of Beddings', '657'],
                ['Number of Works', '786'],
                ['Number of Disputes', '65'],
              ].map(([label, value], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      backgroundColor: '#f0f0f0',
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body1">
                      <strong>{label} :</strong> {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

<Typography variant="h6" fontWeight="bold" mb={2} mt={2}>
  Skills
</Typography>

{Array.isArray(userDetails.skills) && userDetails.skills.length > 0 ? (
  userDetails.skills.map((skill, index) => (
    <Paper
      key={index}
      elevation={1}
      sx={{
        borderRadius: 3,
        padding: 3,
        mb: 2,
        border: '1px solid #ccc',
      }}
    >
      <Stack spacing={2}>
        {/* Skill Items */}
        {[
          `Skill Name : ${skill.work}`,
          `Title : ${skill.title}`,
          `Experience : ${skill.experience}`,
        ].map((text, idx) => (
          <Box
            key={idx}
            sx={{
              backgroundColor: '#eaeaea',
              borderRadius: 2,
              padding: 1.5,
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  ))
) : (
  <Typography variant="body2" color="text.secondary">
    No skills added.
  </Typography>
)}




      <Typography variant="h6" gutterBottom fontWeight="bold">
        KYC Documents
      </Typography>

      {identityProofs.map((item, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            borderRadius: 3,
            padding: 3,
            border: '1px solid #ccc',
            mt: 3,
          }}
        >
          <Box display="flex" alignItems="stretch" gap={2}>
            {/* Image Card */}
            <Card
              sx={{
                width: 250,
                p: 2,
                borderRadius: 3,
                boxShadow: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Box position="absolute" top={8} left={8}>
                <Chip
                  icon={<CheckCircleIcon sx={{ color: 'white' }} />}
                  label=""
                  sx={{
                    bgcolor: 'green',
                    height: 28,
                    width: 28,
                    borderRadius: '50%',
                  }}
                />
              </Box>

              <Box mt={4}>
                <img
                  src={`http://localhost:3001/storege/userdp/${item}`}
                  alt="KYC Document"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Card>

            {/* Description Card */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                boxShadow: 3,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Box display="flex" gap={1} mb={2}>
                <Button
                  variant={statuses[index] === 'accepted' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => handleStatusChange(index, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant={statuses[index] === 'rejected' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => handleStatusChange(index, 'rejected')}
                >
                  Reject
                </Button>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Box
                  mt={1}
                  sx={{
                    height: 60,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Paper>
      ))}



<Box>
  <Tables userDetails={userDetails}/>
</Box>



      </Paper>
    </Box>
  );
};

export default UserDetails;
