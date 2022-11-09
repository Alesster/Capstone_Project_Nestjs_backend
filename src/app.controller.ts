import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService, CandidateSelect } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('voter-information')
  getVoterInfo(@Query('address') address: string) {
    return this.appService.getVoterInfo(address);
  }

  @Post('give-right-to-vote')
  giveRightToVote(@Query('address') address: string) {
    return this.appService.giveRightToVote(address);
  }

  @Post('cast-vote')
  castVote(@Body() body: CandidateSelect) {
    return this.appService.castVote(body);
  }

  @Get('winner-list-score')
  getWinnerListScore() {
    return this.appService.getWinnerListScore();
  }
}
