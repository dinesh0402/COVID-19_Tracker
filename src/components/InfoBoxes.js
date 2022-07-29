import React from 'react'
import {Card, CardContent, Typography} from '@mui/material'
import '../styles/InfoBox.css'

function InfoBoxes({title,cases,total,active,isRed, ...props}) {
  return (
    <Card 
      onClick = {props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
        <CardContent>
            {/* Title */}
            <Typography className='infoBox__title' color="textSecondary">
                {title}
            </Typography>

            {/* no. of cases */}
            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

            {/* total cases */}
            <Typography className='infoBox__total' color='textSecondary'>
                {total} Total
            </Typography>
        </CardContent>
    </Card>
  )
}

export default InfoBoxes